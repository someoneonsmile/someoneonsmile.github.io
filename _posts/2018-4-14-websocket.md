
### websocket
---

#### websocket 与 stomp

```
简而言之:
    WebSocket 是底层协议，SockJS 是WebSocket 的备选方案，也是底层协议
    而 STOMP 是基于 WebSocket（SockJS） 的上层协议
    websocket 相当于 tcp, stomp 相当于 http
```

#### 简约流程

- **websocket 代理**

> java

```java
@Slf4j
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints( StompEndpointRegistry registry ) {
        registry.addEndpoint("/socket", "/another").withSockJS();
    }


    @Override
    public void configureMessageBroker( MessageBrokerRegistry registry ) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
    }


    @Override
    public void configureClientInboundChannel( ChannelRegistration registration ) {
        registration.taskExecutor().corePoolSize(4) // 核心线程数
            .maxPoolSize(8)  // 最大线程数
            .keepAliveSeconds(60) // 线程活动时间
            .queueCapacity(512); // 等待线程数
        super.configureClientInboundChannel(registration);
    }


    @Override
    public void configureWebSocketTransport( WebSocketTransportRegistration registration ) {

        // 消息大小限制
        registration.setMessageSizeLimit(2 * 1024);

        // 控制未发送消息的缓冲范围 (ms)
        registration.setSendTimeLimit(10 * 1000);

        // 设置缓存大小
        registration.setSendBufferSizeLimit(512 * 1024);

        registration.addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {

            @Override
            public WebSocketHandler decorate( WebSocketHandler handler ) {
                return new WebSocketHandlerDecorator(handler) {

                    /**
                     * 建立 WebSocket 连接之后
                     */
                    @Override
                    public void afterConnectionEstablished( @Nullable final WebSocketSession session ) throws Exception {
                        if ( session == null ) {
                            throw new RuntimeException("session is null");
                        }
                        Principal principal = session.getPrincipal();
                        if ( principal == null ) {
                            throw new RuntimeException("principal is null");
                        }
                        String username = principal.getName();
                        // WebSocketSessionBean webSocketSessionBean = new WebSocketSessionBean(username, serverConfiguration.getServerId());
                        log.info("上线: " + username);
                        // webSocketRepository.save(webSocketSessionBean);
                        super.afterConnectionEstablished(session);
                    }


                    /**
                     * 关闭 WebSocket 连接之后
                     */
                    @Override
                    public void afterConnectionClosed( @Nullable WebSocketSession session, @Nullable CloseStatus closeStatus ) throws Exception {
                        if ( session == null || closeStatus == null ) {
                            throw new RuntimeException("session isnull or closeStatus is null");
                        }
                        Principal principal = session.getPrincipal();
                        if ( principal == null ) {
                            throw new RuntimeException("principal is null");
                        }
                        String username = principal.getName();
                        log.info("下线: " + username);
                        // webSocketRepository.deleteByKeyAndValue(username, serverConfiguration.getServerId());
                        super.afterConnectionClosed(session, closeStatus);
                    }


                    /**
                     * 处理错误消息
                     */
                    @Override
                    public void handleTransportError( WebSocketSession session, Throwable exception ) throws Exception {
                        super.handleTransportError(session, exception);
                    }


                    /**
                     * 接收消息时的事件
                     */
                    @Override
                    public void handleMessage( WebSocketSession session, WebSocketMessage<?> message ) throws Exception {
                        super.handleMessage(session, message);
                    }
                };
            }
        });
        super.configureWebSocketTransport(registration);
    }
}
```


```java
@Controller
public class GreetingController {

    @Resource
    private SimpMessagingTemplate simpMessagingTemplate;


    @RequestMapping({"/", "/index", "/main"})
    public String index() {
        return "/index.html";
    }


    @MessageMapping("/wechat")
    @SendTo("/topic/notice")
    public String greeting(String value) {
        // this.simpMessagingTemplate.convertAndSend("/topic/notice", value);
        return value;
    }
    
    
    @MessageMapping("/sendToUser")
    @SendToUser( value = "/queue/notice", broadcast = false)
    public String greeting(String value, Principal principal) {
        System.out.println("精准推送, 只推送到" + principal.getName());
        // this.simpMessagingTemplate.convertAndSendToUser(principal.getName(), "/topic/notice", value);
        return value;
    }
}
```

> js

```js
let s = new SockJS('/socket');
stompClient = Stomp.over(s);
stompClient.connect({}, function (frame) {
    setConnected(true);
});

// 发送消息
stompClient.send("/app/wechat", {}, value);
```

- **sockjs 方式**

```java
@Configuration
public class WebSocketConfig {

    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
```


```java
@ServerEndpoint( "/socket" )
@Component
public class Socket {

    private Session session;


    @OnOpen
    public void onOpen( Session session ) {
        try {
            this.session = session;
            session.getBasicRemote().sendText("你好");
        } catch ( IOException e ) {
            e.printStackTrace();
            try {
                session.close();
            } catch ( IOException e1 ) {

            }
        }
        System.out.println("onOpend");
    }


    @OnMessage
    public void onMessage( String message, Session session ) {
        try {
            session.getBasicRemote().sendText(message + ", 你好");
        } catch ( IOException e ) {
            e.printStackTrace();
            try {
                session.close();
            } catch ( IOException e1 ) {

            }
        }
        System.out.println("message: " + message);
    }


    @OnClose
    public void onClose( Session session ) {
        System.out.println("OnClose");
    }


    @OnError
    public void onError( Throwable e ) {
        System.out.println(e.getMessage());
    }
}

```

> js

```js
ws = new WebSocket("ws://localhost:8089/socket");
ws.onopen = function(event){
    console.log(event);
};
ws.onmessage = function(event){
    document.getElementById("wc").innerHTML = event.data;
};

```

> 使用 stomp 协议 时用  
> @ServerEndpoint 监听事件不起作用

---

- [阮一峰](http://www.ruanyifeng.com/blog/2017/05/websocket.html)

- [any-im 实战](http://www.spring4all.com/article/209)

- [详细原理](https://blog.csdn.net/PacosonSWJTU/article/details/51914567)

- [@SendToUser](https://blog.csdn.net/yingxiake/article/details/51224569)