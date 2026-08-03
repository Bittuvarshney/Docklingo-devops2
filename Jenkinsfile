
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'bittoovarshney/linguify-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
        K8S_DEPLOYMENT = 'linguify-app'
        K8S_CONTAINER = 'linguify-app'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                        -u "$DOCKER_USERNAME" \
                        --password-stdin
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying ${IMAGE_NAME}:${IMAGE_TAG} to Kubernetes..."

                sh """
                    kubectl set image deployment/${K8S_DEPLOYMENT} \
                    ${K8S_CONTAINER}=${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Kubernetes Rollout') {
            steps {
                echo "Waiting for Kubernetes rollout..."

                sh """
                    kubectl rollout status deployment/${K8S_DEPLOYMENT} \
                    --timeout=180s
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get deployment'
                sh 'kubectl get pods -o wide'
                sh 'kubectl get svc'
            }
        }
    }

    post {

        success {
            echo '''
            ==========================================
            GitHub
                ↓
            Jenkins
                ↓
            Docker Build
                ↓
            Docker Hub
                ↓
            Kubernetes
                ↓
            Linguify Deployment
            ==========================================
            CI/CD PIPELINE SUCCESSFUL!
            ==========================================
            '''
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }

        always {
            sh 'docker logout || true'
        }
    }
}

