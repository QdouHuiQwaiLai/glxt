FROM python:3

ENV PYTHONUNBUFFERED 1

WORKDIR /imtepr

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . ./
#CMD nohup celery -A imtepr worker -l info &
#CMD nohup python manage.py runserver 0.0.0.0:8000 &
#CMD ["nohup", "celery", "-A", "imtepr", "worker", "-l", "info", "&"]
CMD ["python", "./manage.py", "runserver", "0.0.0.0:8000"]