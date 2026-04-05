# SmartLearn - Online Proctoring Quiz Platform

A comprehensive online examination platform with AI-powered proctoring capabilities, built with Spring Boot and React.

## 🚀 Features

### For Students
- **Secure Quiz Taking**: Take quizzes with real-time proctoring
- **Face Detection**: AI-powered face recognition to prevent cheating
- **Tab Monitoring**: Automatic detection of tab switching during exams
- **Camera Integration**: Live video feed monitoring throughout the test
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### For Administrators
- **Admin Dashboard**: Complete quiz management system
- **Test Creation**: Create and manage multiple-choice question tests
- **Question Management**: Add, edit, and organize questions by difficulty
- **Analytics**: View detailed analytics and performance metrics
- **User Management**: Manage student accounts and permissions

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x** - REST API framework
- **Spring Security** - Authentication and authorization
- **JPA/Hibernate** - Database ORM
- **MySQL** - Database
- **JWT** - Token-based authentication

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **TensorFlow.js** - AI/ML for face detection
- **React Router** - Client-side routing

### AI/ML Features
- **Face Detection**: Real-time face recognition using TensorFlow.js
- **Proctoring**: Automated monitoring during examinations
- **Image Processing**: Canvas-based image capture and analysis

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## 🔧 Installation & Setup

### Backend Setup
```bash
cd smartlearn
# Configure MySQL database in src/main/resources/application.properties
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd smartlearn-ui
npm install
npm run dev
```

### Database Configuration
Update `smartlearn/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartlearn
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)
1. Connect your GitHub repository
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
3. Deploy automatically on push

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

## 📱 Usage

1. **Admin Login**: Access admin dashboard to create tests and manage questions
2. **Student Registration**: Students can register and login
3. **Take Quiz**: Students can attempt available quizzes with proctoring
4. **View Results**: Check scores and analytics after completion

## 🔒 Security Features

- JWT-based authentication
- Password encryption
- Role-based access control
- Real-time proctoring
- Tab switching detection
- Face verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Prabhanshu Pawar** - *Initial work* - [prabhanshupawar-tech](https://github.com/prabhanshupawar-tech)

## 🙏 Acknowledgments

- TensorFlow.js team for the amazing ML library
- Spring Boot community for the robust framework
- React team for the excellent UI library