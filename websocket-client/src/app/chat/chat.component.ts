import { Component, OnInit } from '@angular/core';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import $ from 'jquery';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  public title = 'WebSockets chat';
  private stompClient;

  public chat;

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {

    /* this is the endpoint that is added in the registerStompEndpoints() 
     * method in the server code.
     */
    const socket = new SockJS('ws://localhost:8080/socket');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe("/user/queue/reply", (message) => {
          // $(".chat").append("<div class='message'>" + JSON.parse(message.body).message + "</div>")
          $(".chat").append("<div class='message'>"+message.body+"</div>")
          // console.log(JSON.parse(message.body));
       });
    });
  }

  sendMessage(message) {
    /* (void) send(destination, headers = {}, body = '')
     *     Send a message to a named destination.
     */
    // this.stompClient.send("/app/send/message", {}, JSON.stringify(this.chat));
    this.stompClient.send("/app/message",{},message);
    this.chat = null;
  }
}
