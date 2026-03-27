pipeline {
    // This tells Jenkins it can run on any available worker node
    agent any 

    environment {
        // Useful to let scripts know they are running in an automated environment
        CI = 'true'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                // Pulls the latest code from your Git repository (GitHub, GitLab, etc.)
                checkout scm
            }
        }

stage('2. Spin Up Environment (Docker)') {
            steps {
                echo 'Starting Database, Backend, and Frontend containers...'
                
                dir('p2m_ecommerce-main') {
                    
                    // 1. Generate the .env file on the fly for Docker
                    sh '''
                    cat <<EOT > ecommerce/server/.env
GEMINI_API_KEY=AIzaSyAi-O9wppFZoZkpRagxxV0rs6eu7FfAhZY
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=RFdn1234?!
DB_NAME=smart_db
DB_PORT=5432
EOT
                    '''
                    
                    // 2. Spin up the containers now that the .env is in place
                    sh 'docker-compose up -d --build'
                }
                
                // 3. Give the containers 10 seconds to fully boot up before moving on
                sh 'sleep 10'
            }
        }

        stage('3. Install Playwright Dependencies') {
            steps {
                // Navigate into your frontend folder (where your tests live)
                dir('ecommerce/frontend') {
                    echo 'Installing NPM packages and Playwright browsers...'
                    sh 'npm install'
                    // Installs the invisible (headless) browsers Playwright needs
                    sh 'npx playwright install --with-deps chromium' 
                }
            }
        }

        stage('4. Run Playwright Tests') {
            steps {
                dir('ecommerce/frontend') {
                    echo 'Running E2E tests...'
                    // Runs the tests headlessly (without the --ui flag)
                    sh 'npx playwright test'
                }
            }
        }
    }

    // The 'post' block runs AFTER the stages, no matter what happens
    post {
        always {
            echo 'Tearing down Docker containers to keep the server clean...'
            // CRITICAL: Shut down the containers even if the test fails!
            sh 'docker-compose down'
            
            // Saves the Playwright HTML report so you can view it inside the Jenkins dashboard
            dir('ecommerce/frontend') {
                archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            }
        }
        success {
            echo '✅ Tests passed! Ready for deployment.'
        }
        failure {
            echo '❌ Tests failed. Please check the Playwright report.'
        }
    }
}