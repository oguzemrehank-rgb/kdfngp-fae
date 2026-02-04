// Forum JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadTopics();
    
    const newTopicBtn = document.getElementById('new-topic-btn');
    if (newTopicBtn) {
        newTopicBtn.addEventListener('click', function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Konu açmak için giriş yapmalısınız.');
                window.location.href = 'giris.html';
                return;
            }
            document.getElementById('new-topic-modal').style.display = 'block';
        });
    }
    
    const newTopicForm = document.getElementById('new-topic-form');
    if (newTopicForm) {
        newTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('topic-title').value;
            const content = document.getElementById('topic-content').value;
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            const topic = {
                id: Date.now(),
                title,
                content,
                author: currentUser.name,
                date: new Date().toLocaleString(),
                replies: []
            };
            
            saveTopic(topic);
            loadTopics();
            document.getElementById('new-topic-modal').style.display = 'none';
            newTopicForm.reset();
        });
    }
    
    const cancelTopicBtn = document.getElementById('cancel-topic-btn');
    if (cancelTopicBtn) {
        cancelTopicBtn.addEventListener('click', function() {
            document.getElementById('new-topic-modal').style.display = 'none';
            document.getElementById('new-topic-form').reset();
        });
    }
});

function saveTopic(topic) {
    const topics = JSON.parse(localStorage.getItem('topics')) || [];
    topics.push(topic);
    localStorage.setItem('topics', JSON.stringify(topics));
}

function loadTopics() {
    const topics = JSON.parse(localStorage.getItem('topics')) || [];
    const topicsList = document.getElementById('topics-list');
    topicsList.innerHTML = '';
    
    if (topics.length === 0) {
        topicsList.innerHTML = '<p>Henüz konu yok. İlk konuyu siz açın!</p>';
        return;
    }
    
    topics.forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic-item';
        topicElement.innerHTML = `
            <h3>${topic.title}</h3>
            <p>${topic.content}</p>
            <small>Yazar: ${topic.author} | Tarih: ${topic.date}</small>
            <div class="replies" id="replies-${topic.id}">
                ${topic.replies.map(reply => `<div class="reply"><strong>${reply.author}:</strong> ${reply.content} <small>${reply.date}</small></div>`).join('')}
            </div>
            <button class="reply-btn" data-topic-id="${topic.id}">Yanıt Ver</button>
            <div class="reply-form" id="reply-form-${topic.id}" style="display: none;">
                <textarea placeholder="Yanıtınızı yazın..." rows="3"></textarea>
                <button class="submit-reply-btn" data-topic-id="${topic.id}">Gönder</button>
                <button class="cancel-reply-btn" data-topic-id="${topic.id}">İptal</button>
            </div>
        `;
        topicsList.appendChild(topicElement);
    });
    
    // Reply buttons
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic-id');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Yanıt vermek için giriş yapmalısınız.');
                window.location.href = 'giris.html';
                return;
            }
            document.getElementById(`reply-form-${topicId}`).style.display = 'block';
        });
    });
    
    // Submit reply
    document.querySelectorAll('.submit-reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic-id');
            const textarea = this.previousElementSibling;
            const content = textarea.value;
            if (!content.trim()) return;
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const reply = {
                author: currentUser.name,
                content,
                date: new Date().toLocaleString()
            };
            
            addReply(topicId, reply);
            loadTopics();
        });
    });
    
    // Cancel reply
    document.querySelectorAll('.cancel-reply-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic-id');
            document.getElementById(`reply-form-${topicId}`).style.display = 'none';
            this.previousElementSibling.previousElementSibling.value = '';
        });
    });
}

function addReply(topicId, reply) {
    const topics = JSON.parse(localStorage.getItem('topics')) || [];
    const topic = topics.find(t => t.id == topicId);
    if (topic) {
        topic.replies.push(reply);
        localStorage.setItem('topics', JSON.stringify(topics));
    }
}