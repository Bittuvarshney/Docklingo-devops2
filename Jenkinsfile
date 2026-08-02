pipeline {
agent any


environment {
    IMAGE_NAME = 'bittoovarshney/linguify-app'
    IMAGE_TAG = "${BUILD_NUMBER}"
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
}

post {
    success {
        echo "GitHub -> Jenkins -> Docker -> Docker Hub SUCCESS!"
    }

    failure {
        echo "Pipeline failed. Check Console Output."
    }
}


}
