from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Note, Todo, Task
from . import db
import json

views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        if request.form.get('type')=='createNote':
            title=request.form.get('title')
            note = request.form.get('note')
            if title=='':
                title='Untitle'
            if len(note) < 1:
                flash('Note is empty!', category='error')
            else:
                new_note = Note(title=title,data=note, user_id=current_user.id)
                db.session.add(new_note)
                db.session.commit()
        elif request.form.get('type')=='editNote':
            id=request.form.get('id')
            title=request.form.get('title_change')
            note = request.form.get('note_change')
            note_change=Note.query.get(id)
            note_change.title=title
            note_change.data=note
            db.session.commit()
        elif request.form.get('type')=='createTodo':
            title=request.form.get('title')
            tasks=request.form.getlist('task')
            if title=='':
                title='Untitle'
            new_todo=Todo(title=title,user_id=current_user.id)
            db.session.add(new_todo)
            db.session.commit()
            for task in tasks:
                new_task=Task(data=task,finish=False,todo_id=new_todo.id)
                db.session.add(new_task)
                db.session.commit()
        elif request.form.get('type')=='EditTodo':
            todoid=request.form.get('TodoId')
            title=request.form.get('title')
            tasks=request.form.getlist('task')
            finishes=request.form.getlist('finish')
            if title=='':
                title='Untitle'
            todo=Todo.query.get(todoid)
            if todo.user_id==current_user.id:
                for old_task in todo.tasks[:]:
                    db.session.delete(old_task)
                    db.session.commit()
                for task,finish in zip(tasks,finishes):
                    if finish=='true':
                        finish=True
                    else:
                        finish=False
                    new_task=Task(data=task,finish=finish,todo_id=todoid)
                    db.session.add(new_task)
                    db.session.commit()


    # print([task.data for task in current_user.todos[0].tasks[:]])
    return render_template("home.html", user=current_user,br='<br>')


@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})

@views.route('/delete-todo', methods=['POST'])
def delete_todo():
    todo = json.loads(request.data)
    todoId = todo['todoId']
    todo = Todo.query.get(todoId)
    if todo:
        if todo.user_id == current_user.id:
            db.session.delete(todo)
            db.session.commit()
            for task in todo.tasks[:]:
                db.session.delete(task)
                db.session.commit()
    return jsonify({})

@views.route('/changeTask-status', methods=['POST'])
def changeTask_status():
    info = json.loads(request.data)
    todoId=info['todoId']
    taskId=info['taskId']
    finish=info['finish']
    todo=Todo.query.get(todoId)
    task=Task.query.get(taskId)
    if info:
        if todo.user_id==current_user.id:
            task.finish=finish
            db.session.commit()
    return jsonify({})