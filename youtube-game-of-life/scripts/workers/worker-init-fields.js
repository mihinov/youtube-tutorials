let lastValue = 0;

onmessage = function(event) {
  console.log('Message received in worker: ', event.data);

  // Отправка сообщения обратно в main thread
  postMessage(JSON.stringify(lastValue) + ' lastValue');

	lastValue = event.data;
};
