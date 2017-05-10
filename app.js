<header>
  <div class="inline col-20" id="h-logo"></div>

  <div class="inline col-60" id="h-current-user">
    <form id="f-user-name">
      <input name='user' id="user-name" placeholder="insert name"/>
    </form>
  </div>

  <div class="inline col-20" id="h-sign-in"></div>
</header>


<section>

  <!--  DROP AND DRAG FEATURES   -->

  <div class="full-height inline col-20" id="features"></div>



  <!--  MESSAGE BOX   -->

  <div class="full-height inline col-50" id="chat-box">

    <div id="chat-box__content">
      <div class="counter-header-height">
        <ul id="messages-list"></ul>
      </div>
    </div>

    <form id="message-form">
      <textarea type="text" name="message" id="message-textarea"></textarea>
      <!--<button>Send</button>-->
    </form>

  </div>



  <!--  CURRENT CONVERSATIONS   -->

  <div class="full-height inline col-15" id="conversations">
    <div class="counter-header-height">
      <ul class="center-text">

          <li v-for="name in names">
              <a>
                  {{name}}
              </a>
          </li>

      </ul>
    </div>
  </div>



  <!--  CONTACT LIST   -->

  <div class="full-height inline col-15" id="contacts">
    <div class="counter-header-height">
      <ul id="contacts-list" class="center-text" ></ul>
    </div>
  </div>
</section>

<script>

window.onload = (function(){
  let data = {
    name:'',
    msg:''
  }

  new Vue ({
    el: '#vue-app',
    data: {
      names:[]
    }
  })

/*
  Vue.components ({ 'conversations', {
    props: ['names']
    template: '#conversations-template',
    }
  })

  Vue.components ({ 'chat-box', {
    props: ['msgs']
    template: '#conversations-template',
    }
  })
*/

  let userName = document.getElementById('user-name');
  let formUserName = document.getElementById('f-user-name');
  let contactsList = document.getElementById('contacts-list');
  let userMsg = document.getElementById('message-textarea');
  let chatBox = document.getElementById('chat-box__content')
  let messageForm = document.getElementById('message-form')
  let messagesList = document.getElementById('messages-list');

  var socket = io();
  formUserName.addEventListener('submit', nameSubmit);
  userMsg.addEventListener('keyup', checkForSendKey);


  function nameSubmit(e){
    e.preventDefault();
    console.log('yep');
    data.name = userName.value;
    socket.emit('new user', data.name);
    userName.setAttribute('disabled', 'true')
    //remove event listener for name submission)
    formUserName.removeEventListener('submit', nameSubmit);
  };

  function checkForSendKey(e) {
    if(e.keyCode == 38){
      displayMsg(e);
    }
    else {
      return;
    }
  }

  function displayMsg(e){
    e.preventDefault();
    data.msg = userMsg.value;
    socket.emit('send message', data);
    userMsg.value = '';
    return false;
  };


  //LISTEN FOR NEW MESSAGES
  socket.on('new message', function(data){
    // Create a <li> node
    let node = document.createElement("li");
    // Create a text node
    let textnode = document.createTextNode(data.name +' says: ' + data.msg);
     // Append the text to <li>
    node.appendChild(textnode);
    messagesList.appendChild(node);
  })
  //END

  //LISTEN FOR NEW/DELETED USERS
  socket.on('user list', function(users){
    //remove all content from users list
    conversations.names = Object.keys(users);
  })
  //END

});

</script>
