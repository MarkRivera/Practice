  function ready(callback){
    // in case the document is already rendered
    if (document.readyState!='loading') callback();
    // modern browsers
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
  }

  ready(function()
  {
    var user = promptUserForName()
    var currentUser = new User(user)

// Class Functions
    function User(name)
    {
      this.name = name || "User";
      this.linksShared;
    }

    function InputBar()
    {
      this.getValue = function()
      {
        this.value = document.getElementById('input').value;
      };

      this.value;
      this.urlValue;

      this.pushValue = function()
      {
        inputFunctions.getValue();
        inputFunctions.parseValue();
        messageBox.messageContainer.push([this.value, this.urlValue]);
      };

      this.urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;

      this.parseValue = function()
      {
        this.urlValue = this.urlRegex.exec(this.value)
      };
    }

    function MessageBox()
    {
      this.messageContainer = [];
      this.historyContainer = [];
      this.urlPreview = {
        jsonObj: null,
        preview: null
      }
      this.moveMessagesToHistory = function()
      {
        this.historyContainer = this.messageContainer.shift();
      }

      this.createUrlPreview = function(url)
      {
        var re = new RegExp("^(http|https)://", "i");
        var www = new RegExp("www","i");
        var completeUrl;
        function fetchStuff(option)
        {
          fetch("https://api.linkpreview.net/?key=5bd3beb9e6834ead6d09cef6ed7218d2e212e85478648&q="+ option)
          .then(function(response)
          {
            return response.json()
          })
          .then(function(myJson) {
            messageBox.urlPreview.jsonObj = myJson;
            messageBox.urlPreview.preview = "<div><a href="+ url +">"+ myJson.title +"</a></div>";

            console.log(messageBox.urlPreview.jsonObj)
          });
        }

        //Verify if protocol is prepended to url:

        if (re.test(url)){
          //Proceed as normal
          fetchStuff(url)
        }

        else {
          // erase everything before the www of the url and prepend
          var arr = www.exec(url);
          completeUrl = "https://" + arr['input'];
          fetchStuff(completeUrl)
        }
      }

      this.displayMessages = function()
      {
        var msgs = this.messageContainer.map(function(msg)
        {
          var msgBox = document.getElementById('messages');

          //Transform the msg into something consumable by html:
          if(!msg[1]){
            msgBox.innerHTML = msgBox.innerHTML + "<p class='tile'>" + msg[0] + "</p>"
          }

          else {
            messageBox.createUrlPreview(msg[1][1]);
            //finds the link in the string and places it within html code:
            msgBox.innerHTML = msgBox.innerHTML + "<p class='tile'>" + msg[0].replace(msg[1][1],"<a href=" + msg[1][1] +">" + msg[1][1] + "</a>")
          }
        })
      }
    }

    function promptUserForName()
    {
      return prompt("Please enter your user name", "Harry Potter");
    }

    /* Initialize the page:
      1) Ask User for name or auto generate one
      2) Init message box
        2a) Init input and listen for events
      3) Init user box
    */

    document.getElementById('user-name').innerHTML = currentUser.name

    var messageBox = new MessageBox();
    var inputFunctions = new InputBar();

    function applyText()
    {
      inputFunctions.pushValue();
      document.getElementById('input').value = "";
      messageBox.displayMessages();
      messageBox.moveMessagesToHistory();
    }

    /*
     Events and their Functions
    */

    document.getElementById('input').addEventListener('keydown', function(e)
    {
      if(e.keyCode == 13) {
        applyText();
      }
      else {
        return
      }
    })
    document.getElementById('msg-btn').addEventListener('click', function(e)
      {
        applyText();
      })
  });
