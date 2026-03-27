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
                // Spins up your exact docker-compose setup in the background

                sh 'docker-compose up -d --build'

                // Gives the containers a few seconds to fully boot up before testing
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