pipeline {
    agent any
    
    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'The branch to build.')
        string(name: 'API_URL', defaultValue: 'https://laravel-api.145238.xyz', description: 'The Web Api Url.')
    }

    environment {
        PROJECT_DIR = '/var/local/jenkins/workspace/laravel-web'
        WEB_DIR = '/www/wwwroot/jenkins/laravel-web'
        NPM_ROOT_DIR = sh(script: 'npm root -g', returnStdout: true).trim()
        PNPM_BIN_DIR = "${NPM_ROOT_DIR}/pnpm/bin"
        PNPM_CJS_BIN = "${PNPM_BIN_DIR}/pnpm.cjs"
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    echo "Running as user: ${env.USER}"
                    
                    // 确保 pnpm 已正确安装
                    if (sh(script: 'command -v pnpm', returnStatus: true) != 0) {
                        if (fileExists(env.PNPM_CJS_BIN)) {
                            echo "Creating symlink for pnpm (cjs)..."
                            sh "ln -sf ${env.PNPM_CJS_BIN} ~/.local/bin/pnpm"
                        } else if (fileExists("${env.PNPM_BIN_DIR}/pnpm")) {
                            echo "Creating symlink for pnpm (bin)..."
                            sh "ln -sf ${env.PNPM_BIN_DIR}/pnpm ~/.local/bin/pnpm"
                        } else {
                            error "pnpm not found. Exiting."
                        }
                    }
                    
                    // 确保 pnpm 已正确安装
                    if (sh(script: 'command -v pnpm', returnStatus: true) != 0) {
                        error "pnpm installation failed. Exiting."
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    echo "Checking out repository from branch ${params.BRANCH_NAME}..."
                    deleteDir() // Clean up the workspace before cloning
                    git url: 'https://github.com/zhangqingxi/laravel-web.git', branch: params.BRANCH_NAME
                }
            }
        }

        stage('Update .env.production') {
            steps {
                script {
                    echo "Updating .env.production file..."
                    
                    // Perform the sed replacement
                    sh """
                        sed -i 's#^VITE_GLOB_API_URL[ ]*=[ ]*.*\$#VITE_GLOB_API_URL=${params.API_URL}#' .env.production
                    """
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo "Installing dependencies..."
                    sh "pnpm install"
                }
            }
        }

        stage('Build Project') {
            steps {
                script {
                    echo "Running build..."
                    sh "pnpm build"
                    
                    // 检查构建目录是否存在
                    if (!fileExists('dist')) {
                        error "Build directory 'dist' does not exist. Aborting."
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "Cleaning up old web site files..."
                    if (fileExists("${env.WEB_DIR}")) {
                        sh "rm -rf ${env.WEB_DIR}/*"
                    } else {
                        echo "Creating web directory..."
                        sh "mkdir -p ${env.WEB_DIR}"
                    }

                    echo "Copying build output to web site directory..."
                    sh "cp -r dist/* ${env.WEB_DIR}/"
                }
            }
        }
    }

    post {
        success {
            echo "Build and deployment completed successfully."
        }
        failure {
            echo "Build or deployment failed."
        }
        always {
            cleanWs() // Clean up the workspace
        }
    }
}
