pipeline {
    agent any
    
    environment {
        IMAGE_NAME = 'playwright-api-tests'
        CONTAINER_NAME = 'playwright-runner'
    }
    
    stages {
        
        stage('Checkout') {
            steps {
                echo '📥 Pulling code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
            }
        }
        
        stage('Run Playwright Tests') {
            steps {
                echo '🎭 Running Playwright API tests...'
                sh '''
                    docker run \
                        --name ${CONTAINER_NAME}-${BUILD_NUMBER} \
                        ${IMAGE_NAME}:${BUILD_NUMBER}
                    
                    docker cp ${CONTAINER_NAME}-${BUILD_NUMBER}:/app/playwright-report ${WORKSPACE}/playwright-report || true
                    docker cp ${CONTAINER_NAME}-${BUILD_NUMBER}:/app/test-results ${WORKSPACE}/test-results || true
                    docker rm ${CONTAINER_NAME}-${BUILD_NUMBER} || true
                '''
            }
        }
        
        stage('Publish Report') {
            steps {
                echo '📊 Publishing test report...'
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
                ])
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up Docker image...'
            sh 'docker rmi ${IMAGE_NAME}:${BUILD_NUMBER} || true'
        }
        success {
            echo '✅ Tests PASSED!'
        }
        failure {
            echo '❌ Tests FAILED!'
        }
    }
}
