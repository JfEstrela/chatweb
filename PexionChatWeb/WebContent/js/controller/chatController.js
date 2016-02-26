angular.module("directive.g+signin").controller("chatController",
		function($scope, PubNub,chatAPI,$rootScope,$location) {

	  $scope.useres= [];
	  var write = true;
	  var writeuser = true;
	  
	  function init(){
		  var WS = window.MozWebSocket ? MozWebSocket : WebSocket;
		  $scope.msgBemVindo = "";
		  $scope.websocket = new WS("ws://localhost:9000/"); 
		  $scope.websocket.onmessage = function(evt) { onMessage(evt) };
		  $scope.websocket.onopen = function(evt) { onOpen(evt) };
		  $scope.websocket.onclose = function(evt) { onClose(evt) };
		  $scope.websocket.onmessage = function(evt) { onMessage(evt) };
		  $scope.websocket.onerror = function(evt) { onError(evt) };
		  $scope.websocket.doSend = function(message) {  
			  write = true;
			  writeuser = true;
			  var clazz = message === "Desconectado!" ? "label label-danger" :"label label-success";
			  $scope.websocket.send(chatAPI.getUserName()+' : '+message+' : '+chatAPI.getUserPhoto() + ' : '+clazz);
		  }
		  if(chatAPI.hasUser()){
			  document.getElementById('user-photo').src = chatAPI.getUserPhoto();
	          document.getElementById('user-photoSB').src = chatAPI.getUserPhoto();
	          document.getElementById('user-name').innerText = chatAPI.getUserName();
	          document.getElementById('user-email').innerText = chatAPI.getUserEmail();
		  }else{
			  $scope.noUser = true;
		  }
		  
	  }
	  init();
 
	  function onOpen(evt){
		  $scope.websocket.doSend("Conectado!");
		  document.getElementById("bemVindo").innerHTML = " <a >Bem Vindo!</a>";

	  }

	  function onClose(evt){ 
		  
	  }

	  function onMessage(evt){ 
		var msg = evt.data.split(' : ');
		var user = msg[0];
		if(document.getElementById(user) != null){
			document.getElementById(user).setAttribute("class", msg[3]);
		}
		if(user != chatAPI.getUserName()){
			if(writeuser){
				writeToScreen( '<span class="text-primary">' +user+'</span></span>: <br/><span class="small"> '+msg[1]+'</span>');
			}
			writeuser = false;
		}else{
			if(write){
				writeToScreen( '<span class="text-primary">' +user+'</span></span>: <br/><span class="small"> '+msg[1]+'</span>');
			}
			write = false;
		}
		
		
	    if(-1 === $scope.useres.indexOf(user)){
	    	$scope.useres.push(user);
	    	if(document.getElementById("contUser") != null){
	    		document.getElementById("contUser").innerHTML = $scope.useres.length;
	    	}
	    	var filho = document.getElementById(user+"li");
	    	if(filho != null){
	    		document.getElementById("list").removeChild(filho);
	    	}
	    	writeToScreenUser( '<img src="'+ msg[2]+'"  style="height:35px;width: 55px;" /><span><span class="'+msg[3]+'" id="'+user+'">' +user+'</span>',user);
	    }
	   
	  }

	 function onError(evt){
	    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
	  }

	
	  $scope.doClose = function(){
		  $scope.websocket.doSend("Desconectado!");
		  $scope.websocket.close();
		  document.getElementById(chatAPI.getUserName()).setAttribute('class','label label-danger');
		  $scope.disabled = true;
	  }
	  
	  $scope.doOpen = function(){
		  init();
		  document.getElementById(chatAPI.getUserName()).setAttribute('class','label label-success');
		  $scope.disabled = false;
	  }
	  function writeToScreen(message,id){
	    var p = document.createElement("p");
	    p.style.wordWrap = "break-word";
	    p.innerHTML = message;
	    p.setAttribute("id","p"+id);
	    if(document.getElementById("chat_history")!= null){
		  document.getElementById("chat_history").appendChild(p);
	    }
	    p.focus();
	    var div = $('#chat_history');
	    div.prop("scrollTop", 
	    div.prop("scrollHeight"));
	   
	  }
	  function writeToScreenUser(inner,user) {
	    var li = document.createElement("li");
	    li.style.wordWrap = "break-word";
	    li.innerHTML = inner;
	    li.setAttribute("id",user+"li");
	    if(document.getElementById("list") != null){
	    	document.getElementById("list").appendChild(li);
	    	document.getElementById("list").appendChild(document.createElement("br"));
	    }
	    var div = $('#listUser');
	    div.prop("scrollTop", 
	    div.prop("scrollHeight"));
	  }
	  
	  $scope.send = function(msg){
		  $scope.websocket.doSend(msg);
		  $scope.newMessage = "";
	  }
	  
	  $scope.logout = function(){
		  chatAPI.logout();
		  logout = true;
		  $scope.websocket.close()
		  $location.path("/login");
          window.location.href = $location.absUrl();
		  
	  }
	  
	  $scope.goLogin = function(){
		  $scope.logout();
	  }
	  $scope.$on('event:google-plus-signin-success', function (event,authResult) { 
		  chatAPI.login(authResult);
		  $scope.msgBemVindo = "Bem vindo!";
		  if(chatAPI.hasUser()){
			  document.getElementById('user-photo').src = chatAPI.getUserPhoto();
	          document.getElementById('user-photoSB').src = chatAPI.getUserPhoto();
	          document.getElementById('user-name').innerText = chatAPI.getUserName();
	          document.getElementById('user-email').innerText = chatAPI.getUserEmail();
	          $scope.noUser = false;
		  }else{
			  $location.path("/login");
              window.location.href = $location.absUrl();
		  }
	 });
	  $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
			 alert("Falha ao logar na conta da google.");
	  });
	  
});