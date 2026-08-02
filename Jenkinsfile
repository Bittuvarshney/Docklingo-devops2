pipeline {
agent any


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
            sh "docker build -t linguify-app:${BUILD_NUMBER} ."
        }
    }

    stage('Docker Test') {
        steps {
            sh 'docker images linguify-app'
        }
    }
}

post {
    success {
        echo 'GitHub -> Jenkins -> Docker SUCCESS!'
    }

    failure {
        echo 'Pipeline failed. Check the Console Output.'
    }
}


}
