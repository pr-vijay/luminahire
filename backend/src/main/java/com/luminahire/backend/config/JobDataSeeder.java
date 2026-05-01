package com.luminahire.backend.config;

import com.luminahire.backend.model.JobListing;
import com.luminahire.backend.repository.JobListingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds the H2 database with real Indian tech company jobs.
 * In production, this would be replaced with a job scraper or API integration.
 */
@Configuration
public class JobDataSeeder {

    @Bean
    CommandLineRunner seedJobs(JobListingRepository repo) {
        return args -> {
            if (repo.count() > 0) return; // Don't re-seed

            List<JobListing> jobs = List.of(
                // ===== BANGALORE =====
                new JobListing("Google", "Senior Frontend Engineer", "Bangalore, India", "Full-time", "₹30-45 LPA",
                    "https://ui-avatars.com/api/?name=G&background=4285F4&color=fff&bold=true&size=64",
                    "Build next-generation web applications using React, TypeScript, and modern web standards. Work with world-class engineers on products used by billions.",
                    "React,TypeScript,JavaScript,HTML,CSS,Node.js,REST API,GraphQL,Git,Agile,Problem Solving",
                    "https://careers.google.com", "https://www.linkedin.com/company/google/jobs/", "https://careers.google.com",
                    "Frontend", "Senior", LocalDate.now().minusDays(2)),

                new JobListing("Google", "ML Engineer — NLP", "Bangalore, India", "Full-time", "₹40-60 LPA",
                    "https://ui-avatars.com/api/?name=G&background=4285F4&color=fff&bold=true&size=64",
                    "Research and develop state-of-the-art NLP models for Google Search and Assistant. Publish research at top conferences.",
                    "Python,TensorFlow,PyTorch,Machine Learning,NLP,Deep Learning,Transformers,Research,Mathematics",
                    "https://careers.google.com", "https://www.linkedin.com/company/google/jobs/", "https://careers.google.com",
                    "AI/ML", "Senior", LocalDate.now().minusDays(1)),

                new JobListing("Flipkart", "React Developer", "Bangalore, India", "Full-time", "₹18-28 LPA",
                    "https://ui-avatars.com/api/?name=FK&background=2874F0&color=fff&bold=true&size=64",
                    "Build performant, mobile-first e-commerce experiences for millions of users. Optimize page load times and user conversion funnels.",
                    "React,JavaScript,TypeScript,Redux,HTML,CSS,Performance Optimization,REST API,Git,Agile",
                    "https://www.flipkartcareers.com", "https://www.linkedin.com/company/flipkart/jobs/", "https://www.flipkartcareers.com",
                    "Frontend", "Mid", LocalDate.now()),

                new JobListing("Razorpay", "Software Engineer — Payments", "Bangalore, India", "Full-time", "₹20-32 LPA",
                    "https://ui-avatars.com/api/?name=RZ&background=3395FF&color=fff&bold=true&size=64",
                    "Build India's leading payments infrastructure. Design scalable APIs processing millions of transactions daily.",
                    "Java,Spring Boot,Microservices,PostgreSQL,Redis,Kafka,Docker,Kubernetes,REST API,SQL",
                    "https://razorpay.com/careers", "https://www.linkedin.com/company/razorpay/jobs/", "https://razorpay.com/careers",
                    "Backend", "Mid", LocalDate.now().minusDays(1)),

                new JobListing("Swiggy", "Full Stack Engineer", "Bangalore, India", "Full-time", "₹15-25 LPA",
                    "https://ui-avatars.com/api/?name=SW&background=FC8019&color=fff&bold=true&size=64",
                    "Build delightful food delivery experiences. Work on real-time order tracking, restaurant management, and delivery optimization.",
                    "React,Node.js,Java,Spring Boot,MongoDB,Redis,Docker,Kubernetes,Microservices,REST API",
                    "https://careers.swiggy.com", "https://www.linkedin.com/company/swiggy/jobs/", "https://careers.swiggy.com",
                    "Fullstack", "Mid", LocalDate.now().minusDays(4)),

                new JobListing("Infosys", "Java Developer", "Bangalore, India", "Full-time", "₹8-15 LPA",
                    "https://ui-avatars.com/api/?name=IN&background=007CC3&color=fff&bold=true&size=64",
                    "Develop enterprise applications for global clients. Work on banking, insurance, and retail digital transformation projects.",
                    "Java,Spring Boot,Hibernate,JPA,SQL,Oracle,REST API,Microservices,Maven,Git",
                    "https://www.infosys.com/careers.html", "https://www.linkedin.com/company/infosys/jobs/", "https://www.infosys.com/careers.html",
                    "Backend", "Entry", LocalDate.now().minusDays(3)),

                // ===== HYDERABAD =====
                new JobListing("Microsoft", "Full Stack Developer", "Hyderabad, India", "Full-time", "₹25-40 LPA",
                    "https://ui-avatars.com/api/?name=MS&background=00A4EF&color=fff&bold=true&size=64",
                    "Join the Azure team building scalable cloud-native applications. Work on TypeScript-based services with React frontends.",
                    "React,TypeScript,C#,.NET,Azure,Docker,Kubernetes,SQL,REST API,Microservices,Git,Agile",
                    "https://careers.microsoft.com", "https://www.linkedin.com/company/microsoft/jobs/", "https://careers.microsoft.com",
                    "Fullstack", "Senior", LocalDate.now().minusDays(3)),

                new JobListing("Amazon", "SDE II — Backend", "Hyderabad, India", "Full-time", "₹28-42 LPA",
                    "https://ui-avatars.com/api/?name=AMZ&background=FF9900&color=111&bold=true&size=64",
                    "Design and build distributed, highly available services for Amazon retail. Own the full lifecycle from design to deployment.",
                    "Java,Spring Boot,AWS,DynamoDB,Microservices,Docker,Kubernetes,CI/CD,SQL,System Design",
                    "https://www.amazon.jobs/en/locations/hyderabad-india", "https://www.linkedin.com/company/amazon/jobs/", "https://www.amazon.jobs",
                    "Backend", "Mid", LocalDate.now().minusDays(1)),

                new JobListing("ServiceNow", "UI Developer", "Hyderabad, India", "Full-time", "₹20-35 LPA",
                    "https://ui-avatars.com/api/?name=SN&background=81B5A1&color=fff&bold=true&size=64",
                    "Build enterprise workflow automation UIs. Work with Angular, React, and Web Components on a platform used by Fortune 500 companies.",
                    "React,Angular,TypeScript,JavaScript,HTML,CSS,Web Components,REST API,Git,Agile",
                    "https://careers.servicenow.com", "https://www.linkedin.com/company/servicenow/jobs/", "https://careers.servicenow.com",
                    "Frontend", "Mid", LocalDate.now().minusDays(5)),

                // ===== GURUGRAM / DELHI NCR =====
                new JobListing("Zomato", "Backend Engineer — Go", "Gurugram, India", "Full-time", "₹18-30 LPA",
                    "https://ui-avatars.com/api/?name=ZO&background=E23744&color=fff&bold=true&size=64",
                    "Build high-performance backend services in Go for food delivery, dining, and hyperpure. Handle millions of requests per second.",
                    "Go,Golang,Microservices,Redis,Kafka,PostgreSQL,Docker,Kubernetes,AWS,CI/CD,REST API",
                    "https://www.zomato.com/careers", "https://www.linkedin.com/company/zomato/jobs/", "https://www.zomato.com/careers",
                    "Backend", "Mid", LocalDate.now().minusDays(2)),

                new JobListing("Paytm", "React Native Developer", "Noida, India", "Full-time", "₹12-22 LPA",
                    "https://ui-avatars.com/api/?name=PT&background=00BAF2&color=fff&bold=true&size=64",
                    "Build cross-platform mobile applications for India's largest digital payments ecosystem. Work on payments, lending, and commerce.",
                    "React Native,React,JavaScript,TypeScript,Redux,REST API,Mobile Development,Git,Agile",
                    "https://paytm.com/careers", "https://www.linkedin.com/company/paytm/jobs/", "https://paytm.com/careers",
                    "Frontend", "Mid", LocalDate.now().minusDays(6)),

                new JobListing("Adobe", "Software Engineer — Creative Cloud", "Noida, India", "Full-time", "₹22-38 LPA",
                    "https://ui-avatars.com/api/?name=AD&background=FF0000&color=fff&bold=true&size=64",
                    "Work on Adobe Creative Cloud web applications. Build collaborative editing features used by millions of designers worldwide.",
                    "React,TypeScript,JavaScript,C++,WebAssembly,Canvas API,REST API,GraphQL,Git,Performance",
                    "https://www.adobe.com/careers.html", "https://www.linkedin.com/company/adobe/jobs/", "https://www.adobe.com/careers.html",
                    "Frontend", "Mid", LocalDate.now().minusDays(4)),

                // ===== PUNE =====
                new JobListing("Persistent Systems", "Spring Boot Developer", "Pune, India", "Full-time", "₹10-18 LPA",
                    "https://ui-avatars.com/api/?name=PS&background=1B3A73&color=fff&bold=true&size=64",
                    "Develop microservices-based enterprise applications for healthcare and banking clients using Spring Boot and cloud technologies.",
                    "Java,Spring Boot,Microservices,PostgreSQL,Docker,AWS,REST API,JPA,Hibernate,Maven,Git",
                    "https://careers.persistent.com", "https://www.linkedin.com/company/persistent-systems/jobs/", "https://careers.persistent.com",
                    "Backend", "Entry", LocalDate.now().minusDays(2)),

                new JobListing("Pubmatic", "Data Engineer", "Pune, India", "Full-time", "₹18-28 LPA",
                    "https://ui-avatars.com/api/?name=PM&background=00C4B4&color=fff&bold=true&size=64",
                    "Build large-scale data pipelines processing billions of ad impressions daily. Work with Spark, Kafka, and cloud data warehouses.",
                    "Python,Spark,Kafka,SQL,AWS,Hadoop,ETL,Airflow,Data Modeling,Scala,Big Data",
                    "https://pubmatic.com/careers/", "https://www.linkedin.com/company/pubmatic/jobs/", "https://pubmatic.com/careers/",
                    "Data", "Mid", LocalDate.now().minusDays(3)),

                // ===== MUMBAI =====
                new JobListing("JPMorgan Chase", "Software Engineer — Risk Platform", "Mumbai, India", "Full-time", "₹20-35 LPA",
                    "https://ui-avatars.com/api/?name=JP&background=003366&color=fff&bold=true&size=64",
                    "Build next-generation risk management platforms for one of the world's largest financial institutions.",
                    "Java,Spring Boot,Python,React,SQL,PostgreSQL,Docker,Kubernetes,Microservices,Agile,CI/CD",
                    "https://jpmorgan.com/careers", "https://www.linkedin.com/company/jpmorganchase/jobs/", "https://jpmorgan.com/careers",
                    "Fullstack", "Mid", LocalDate.now().minusDays(5)),

                new JobListing("Reliance Jio", "DevOps Engineer", "Mumbai, India", "Full-time", "₹15-25 LPA",
                    "https://ui-avatars.com/api/?name=JIO&background=0A1172&color=fff&bold=true&size=64",
                    "Manage cloud infrastructure for India's largest telecom operator. Automate deployments and ensure 99.99% uptime.",
                    "Docker,Kubernetes,AWS,Terraform,Jenkins,CI/CD,Linux,Python,Bash,Monitoring,Ansible",
                    "https://careers.jio.com", "https://www.linkedin.com/company/reliance-jio-infocomm-limited/jobs/", "https://careers.jio.com",
                    "DevOps", "Mid", LocalDate.now().minusDays(1)),

                // ===== CHENNAI =====
                new JobListing("Zoho", "Full Stack Developer", "Chennai, India", "Full-time", "₹8-18 LPA",
                    "https://ui-avatars.com/api/?name=ZH&background=DC2626&color=fff&bold=true&size=64",
                    "Build SaaS products used by 80M+ users worldwide. Work on Zoho CRM, Zoho One, and new product lines.",
                    "Java,JavaScript,React,MySQL,REST API,Git,HTML,CSS,Linux,Problem Solving",
                    "https://www.zoho.com/careers.html", "https://www.linkedin.com/company/zoho/jobs/", "https://www.zoho.com/careers.html",
                    "Fullstack", "Entry", LocalDate.now().minusDays(7)),

                new JobListing("Freshworks", "Backend Engineer — Python", "Chennai, India", "Full-time", "₹15-28 LPA",
                    "https://ui-avatars.com/api/?name=FW&background=2563EB&color=fff&bold=true&size=64",
                    "Build scalable SaaS backend services for Freshdesk and Freshsales. Handle millions of customer support interactions.",
                    "Python,Django,Flask,PostgreSQL,Redis,Docker,AWS,Microservices,REST API,Celery,Git",
                    "https://www.freshworks.com/company/careers/", "https://www.linkedin.com/company/freshworks/jobs/", "https://www.freshworks.com/company/careers/",
                    "Backend", "Mid", LocalDate.now().minusDays(3)),

                // ===== REMOTE INDIA =====
                new JobListing("Stripe", "Software Engineer — Payments", "Remote, World", "Full-time", "₹30-50 LPA",
                    "https://ui-avatars.com/api/?name=ST&background=635BFF&color=fff&bold=true&size=64",
                    "Build the economic infrastructure of the internet. Work on payment processing, fraud detection, and financial APIs.",
                    "Java,Ruby,Go,React,TypeScript,PostgreSQL,AWS,Docker,Microservices,API Design,System Design",
                    "https://stripe.com/jobs", "https://www.linkedin.com/company/stripe/jobs/", "https://stripe.com/jobs",
                    "Backend", "Senior", LocalDate.now().minusDays(2)),

                new JobListing("Atlassian", "Frontend Engineer — Jira", "Remote, India", "Full-time", "₹25-40 LPA",
                    "https://ui-avatars.com/api/?name=AT&background=0052CC&color=fff&bold=true&size=64",
                    "Build the next generation of Jira — the world's most popular project management tool. Work on real-time collaboration features.",
                    "React,TypeScript,GraphQL,Node.js,REST API,Performance Optimization,Accessibility,Git,Agile,Testing",
                    "https://www.atlassian.com/company/careers", "https://www.linkedin.com/company/atlassian/jobs/", "https://www.atlassian.com/company/careers",
                    "Frontend", "Senior", LocalDate.now().minusDays(4)),

                new JobListing("Meesho", "Android Developer", "Remote, India", "Full-time", "₹15-25 LPA",
                    "https://ui-avatars.com/api/?name=ME&background=F43F5E&color=fff&bold=true&size=64",
                    "Build mobile commerce experiences for 150M+ users. Optimize app performance for low-end Android devices across India.",
                    "Kotlin,Android,Java,MVVM,Retrofit,Room,Jetpack Compose,REST API,Firebase,Git",
                    "https://meesho.io/careers", "https://www.linkedin.com/company/meesho/jobs/", "https://meesho.io/careers",
                    "Mobile", "Mid", LocalDate.now().minusDays(1)),

                new JobListing("CRED", "iOS Engineer", "Bangalore, India", "Full-time", "₹22-38 LPA",
                    "https://ui-avatars.com/api/?name=CR&background=1A1A2E&color=E94560&bold=true&size=64",
                    "Build premium credit card management experiences for high-trust users. Pixel-perfect UI with butter-smooth animations.",
                    "Swift,iOS,SwiftUI,UIKit,Core Data,REST API,MVVM,Git,CI/CD,Design Systems",
                    "https://careers.cred.club", "https://www.linkedin.com/company/cred-club/jobs/", "https://careers.cred.club",
                    "Mobile", "Mid", LocalDate.now().minusDays(3)),

                new JobListing("PhonePe", "Data Scientist", "Bangalore, India", "Full-time", "₹20-35 LPA",
                    "https://ui-avatars.com/api/?name=PP&background=5F259F&color=fff&bold=true&size=64",
                    "Apply ML to fraud detection, credit scoring, and user behavior prediction for India's top UPI payments platform.",
                    "Python,Machine Learning,TensorFlow,SQL,Spark,Statistics,Deep Learning,NLP,Data Analysis,A/B Testing",
                    "https://www.phonepe.com/careers/", "https://www.linkedin.com/company/phonepe-internet/jobs/", "https://www.phonepe.com/careers/",
                    "AI/ML", "Mid", LocalDate.now().minusDays(2)),
                    
                // ===== STARTUPS =====
                new JobListing("NextGen Robotics", "Embedded Systems Intern", "Bangalore, India", "Internship", "₹2-4 LPA",
                    "https://ui-avatars.com/api/?name=NR&background=10B981&color=fff&bold=true&size=64",
                    "Work with our core team on developing embedded systems for autonomous drones. Great opportunity for freshers.",
                    "C,C++,Microcontrollers,IoT,Robotics,Python,Linux",
                    "https://example.com/jobs", "https://linkedin.com", "https://example.com",
                    "Hardware", "Fresher", LocalDate.now().minusDays(1)),
                
                new JobListing("FinTech Innovators", "Junior Backend Developer", "Mumbai, India", "Full-time", "₹6-10 LPA",
                    "https://ui-avatars.com/api/?name=FI&background=F59E0B&color=fff&bold=true&size=64",
                    "Join our fast-growing fintech startup. You'll work on building secure APIs for our new payment gateway.",
                    "Node.js,Express,MongoDB,REST API,JavaScript,Git",
                    "https://example.com/jobs", "https://linkedin.com", "https://example.com",
                    "Backend", "Fresher", LocalDate.now()),
                    
                // ===== GLOBAL =====
                new JobListing("OpenAI", "AI Safety Researcher", "San Francisco, CA, USA", "Full-time", "$200k-$400k",
                    "https://ui-avatars.com/api/?name=OA&background=10A37F&color=fff&bold=true&size=64",
                    "Conduct research on alignment and safety of large language models. Publish findings and contribute to model development.",
                    "Python,PyTorch,Machine Learning,Deep Learning,Research,NLP",
                    "https://openai.com/careers", "https://linkedin.com", "https://openai.com",
                    "AI/ML", "Senior", LocalDate.now().minusDays(5)),
                    
                new JobListing("Spotify", "Data Engineer", "Stockholm, Sweden", "Full-time", "€70k-€100k",
                    "https://ui-avatars.com/api/?name=SP&background=1DB954&color=fff&bold=true&size=64",
                    "Build data pipelines that power personalized music recommendations for millions of users globally.",
                    "Python,Java,Scala,Spark,Hadoop,GCP,SQL,Big Data",
                    "https://spotifyjobs.com", "https://linkedin.com", "https://spotify.com",
                    "Data", "Mid", LocalDate.now().minusDays(2))
            );

            repo.saveAll(jobs);
            System.out.println("✅ Seeded " + jobs.size() + " job listings across India into the database.");
        };
    }
}
