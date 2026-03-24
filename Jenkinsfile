pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // This pulls your latest code from GitHub
                git branch: 'main', url: 'https://github.com/fedi67/p2m_ecommerce.git'
            }
        }
        
        stage('Verify Docker') {
            steps {
                // Just to prove Jenkins can talk to your computer's Docker!
                sh 'docker version'
                cd 'ecommerce'
                sh 'docker-compose version'
            }
        }

        stage('Build & Deploy') {
            steps {
                // 1. Create the server folder (just in case) and generate the .env file
                sh '''
                mkdir -p server
                
                echo "DATABASE_URL=postgres://user:password@db:5432/dbname" > ecommerce/server/.env
                echo "SECRET_KEY=my_super_secret_key" >> server/.env
                echo "PORT=5000" >> ecommerce/server/.env
                '''
                
                // 2. Now run Docker Compose!
                sh 'docker-compose up -d --build'
            }
        }
    }
}