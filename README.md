# EduTech_New

## Project Setup

### Clone the Repository

```bash
git clone https://github.com/AjinthaSivam/YGC.git
cd YGC
code .
```
### Backend Setup
Navigate to the Backend Directory:
```
cd backend
```

Set Up the Virtual Environment:
```
python -m venv venv
./venv/Scripts/activate
```

Install Dependencies:
```
pip install -r requirements.txt
```

Create an .env File:
Create a .env file in the backend root directory with the following content:
```
OPENAI_API_KEY=your_api_key_here
DB_NAME=edutech_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

Run Migrations:
```
python manage.py makemigrations
python manage.py migrate
```

Run the Development Server:
```
python manage.py runserver
```

### Frontend Setup
Navigate to the Frontend Directory:
```
cd frontend
```
Install Dependencies:
```
npm install
```

Run the Development Server:
```
npm run dev
```
