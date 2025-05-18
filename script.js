      alert('NurChat is new chatbot! NurChat know only Kazakh language. English and Russian soon...')
    let responses = {};

    fetch("responses.json")
      .then(res => res.json())
      .then(data => {
        responses = data;
      });

    const chatContainer = document.getElementById('chatContainer');
    const subtitle = document.getElementById('subtitle');

    function handleMessage() {
      const input = document.getElementById('userInput');
      const text = input.value.trim();
      if (text === '') return;

      addMessage(text, 'user');

      setTimeout(() => {
        const reply = generateFakeAIResponse(text);
        addMessage(reply, 'bot');
      }, 400);

      input.value = '';
      subtitle.style.opacity = '0';
      setTimeout(() => {
        subtitle.style.display = 'none';
      }, 500);
    }

    function addMessage(message, sender) {
      const msg = document.createElement('div');
      msg.classList.add('message', sender);
      msg.textContent = message;
      chatContainer.appendChild(msg);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function generateFakeAIResponse(text) {
      const lower = text.toLowerCase();

      let expr = lower
        .replace(/қосу/g, "+")
        .replace(/алу/g, "-")
        .replace(/көбейту|×/g, "*")
        .replace(/бөлу|÷/g, "/")
        .replace(/қанша|нәтижесі|тең|=|\?/g, "")
        .replace(/квадрат түбір\s*(\d+)/g, "sqrt($1)")
        .replace(/,/g, ".")
        .trim();

      try {
        const result = math.evaluate(expr);
        if (typeof result === 'number' || typeof result === 'bigint') {
          return `Нәтиже: ${result}`;
        }
      } catch (err) {}

      const found = Object.keys(responses).filter(key => lower.includes(key));
      if (found.length > 0) {
        return found.map(k => responses[k]).join("\n");
      }

      return "Мен оны нақты білмеймін, немесе бұл сөз кітапханада жоқ";
    }
