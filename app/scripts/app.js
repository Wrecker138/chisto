'use strict';
var app = new Vue({
	el: '#app',
	data: {
		info:'',
		roomAmount: 1,
		wcAmount: 1,
		squareAmount:10,
		defaultPrice: 4000,
		defaultSquarePrice: 0,
		memoryPrice:0,
		minPrice: 4000,
		cleanTime: 4,
		realTime:'4 часа',
		roomPrice: 1000,
		wcPrice: 1000,
		squarePrice: 0,
		isResidential:true,
		isFurniture:false,
		listOutputDefault:['Приезжаем на место', '','Делаем уборку 1 комнаты и 1 санузла'],
		listOutput:['Приезжаем на место', '','Делаем уборку 1 комнаты и 1 санузла'],
		showCalc: false,
		showFeed: false,
		showMain:true,
		isSquareInput: false,
		isCalcFormShow: false,
		strRoom: '1 комната',
		strWc: '1 санузел',
		listRoom:' комнаты',
		listWc:' санузла',
		isMobile: false,
		formError:'',
		formPhone:'',
		calcData: '',
		formUrl:global.ajax_url,
		optionsWPData:''
	},
	methods: {
		collectCalcData() {
			this.calcData = '<b>Стоимость:</b> ' + this.defaultPrice + ' руб. <br>';
			if (this.isResidential) {
				this.calcData += '<b>Тип помещения:</b> Жилое <br>';
				this.calcData += '<b>Площадь уборки:</b> ' + this.strRoom + ' и '+ this.strWc  + '<br>';
			}
			else {
				this.calcData += '<b>Тип помещения:</b> Нежилое <br>';
				this.calcData += '<b>Площадь уборки:</b> ' + this.squareAmount +  ' м² <br>';
			}

			if (this.isFurniture) {
				this.calcData += '<b>Мебель:</b> Есть <br>';
			}
			else {
				this.calcData += '<b>Мебель:</b> Нет <br>';
			}
			// this.calcData += ''
			// console.log(this.calcData);
		},
		sendForm() {
			let data = new FormData();
			data.append('phone', this.formPhone);
			if (this.calcData != '') data.append('calcData', this.calcData);
			data.append('action', 'form_sent');
			// console.log(this.formPhone);
			if (this.validForm()) {

				this.clearFormError();
				axios
					.post(this.formUrl, data,{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						}
					})
					.then(response => {
						console.log(JSON.stringify(response, null, 2));
						ym(51632120, 'reachGoal', 'order_calculation');
					})
					.catch(error => {
						console.log(error.response)
					})

				this.showMain = false;
				this.showCalc = false;
				this.showFeed = true;
			}
			else this.formError = 'Введите телефон';
		},
		clearFormError () {
			this.formError = '';
		},
		validForm () {
			let isValid = true;
			if (!this.formPhone != '') isValid = false
			// else isValid = false;
			return isValid;
		},
		fixSquareValue: function () {
			if (this.squareAmount < 10) this.squareAmount = 10;
		},
		addValue: function (value,elem,word1,word2,word3,price) {
			this[value]++;
			if (word1 == null || word2 == null || word3 == null) {
				this.countBySquare(this[value]);
			}
			else {
				this.getNumEnding(elem,this[value], word1, word2, word3);
				this.increasePrice(this[price],this[value]);
			}
		},
		delValue: function (value,elem,word1,word2,word3,price) {
			this[value]--;
			if (word1 == null || word2 == null || word3 == null) {
				this.countBySquare(this[value]);
			}
			else {
				this.getNumEnding(elem,this[value], word1, word2, word3);
				this.reducePrice(this[price],this[value]);
			}
		},
		increasePrice: function(price,value) {
			// console.log(value)
			if (value === 1) this.defaultPrice = this.defaultPrice;
			else {
				if (!this.isFurniture)
					this.defaultPrice += price;
					// this.memoryPrice = this.defaultPrice;
				else  {

					this.defaultPrice = Math.round(this.defaultPrice / 1.25) + price;
					// console.log(this.defaultPrice)
					this.defaultPrice = Math.round(this.defaultPrice * 1.25)
					// console.log(this.defaultPrice)
				}
			}

			// console.log(price);
			// console.log(Math.round( this.memoryPrice * 0.25));
			this.collectCalcData();
		},
		reducePrice: function(price,value) {
			// console.log('Это минусег' + value);
			if( value === 0 ) this.defaultPrice = this.defaultPrice;
			else if (this.minPrice < this.defaultPrice)	{

				if (!this.isFurniture)
					this.defaultPrice -=  price;
					// this.memoryPrice = this.defaultPrice;
				else  {

					this.defaultPrice = Math.round(this.defaultPrice / 1.25) - price;
					// console.log(this.defaultPrice)
					this.defaultPrice = Math.round(this.defaultPrice * 1.25)
					// console.log(this.defaultPrice)
				}
			}

			this.collectCalcData();
		},
		checkFurniture: function() {
			if (this.isResidential) {
				if (this.isFurniture)  {
					this.memoryPrice = this.defaultPrice;
					this.defaultPrice += Math.round( this.defaultPrice * 0.25);
				}
				else {
					this.defaultPrice =  Math.round( this.defaultPrice / 1.25);
				}
			}

			else {
				this.countBySquare(this.squareAmount);
			}
			// console.log(this.defaultPrice);
			this.collectCalcData();
			this.renderList();
		},
		countBySquare: function (value) {
			if (value < 10) value = 10;
			switch(true) {
				case (50 >= value):
					this.squarePrice = 140;
					break;
				case (value >= 51 && value <= 100):
					this.squarePrice = 120;
					break;
				case  (value >= 101 && value <= 200):
					this.squarePrice = 105;
					break;
				case  (value >= 201 && value <= 300):
					this.squarePrice = 90;
					break;
				case  (value >= 301 && value <= 400):
					this.squarePrice = 75;
					break;
				case  (value >= 401 && value <= 500):
					this.squarePrice = 60;
					break;
				case (value > 500):
					this.squarePrice = 45;
					break;
			}
			this.defaultPrice  = Math.round(value * this.squarePrice);
			if (this.isFurniture) this.defaultPrice = Math.round(value * this.squarePrice) + (Math.round(value * this.squarePrice) * 0.25);
			this.collectCalcData();
			this.renderList();
			console.log( this.squarePrice);
		},
		getNumEnding: function (elem,n, form1, form2, form3) {
			let	n1 = 0;
			n = Math.abs(n) % 100;
			n1 = n % 10;
			if (n >= 10 && n <= 90) this[elem] = n + ' ' +  form3;
			if (n1 > 1 && n1 < 5) this[elem] =  n + ' ' + form2 ;
			if ((n1 > 0 && n1 <= 9) && (n >= 5 && n <= 14)) this[elem] =  n + ' ' +  form3 ;
			if (n1 == 1) this[elem] =  n + ' ' +  form1;
			if (n == 11 && n1 == 1) this[elem] =  n + ' ' +  form3;
			if (n == 0) this[elem] =  n + ' ' +  form3;
			this.collectCalcData();
			this.renderList();
		},
		spellcheckEnding: function (elem,n, form1, form2, form3) {
			let	n1 = 0;
			n = Math.abs(n) % 100;
			n1 = n % 10;
			if (n >= 10 && n <= 90) this[elem] = n + ' ' +  form3;
			if (n1 > 1 && n1 < 5) this[elem] =  n + ' ' + form2 ;
			if ((n1 > 0 && n1 <= 9) && (n >= 5 && n <= 14)) this[elem] =  n + ' ' +  form3 ;
			if (n1 == 1) this[elem] =  n + ' ' +  form1;
			if (n == 11 && n1 == 1) this[elem] =  n + ' ' +  form3;
			if (n == 0) this[elem] =  n + ' ' +  form3;
			return this[elem];
		},
		stickyButton: function (event) {
			let currentWidth = window.innerWidth;
			if (currentWidth <= 650) {
				$(window).bind('scroll', this.defineSticky);
			}
			else {
				$(window).unbind('scroll', this.defineSticky);
			}
		},
		defineSticky: function () {
			if (this.$refs.calcList) {
				if (window.innerHeight + window.pageYOffset - this.$refs.calcList.offsetHeight > this.$refs.calcList.offsetTop) this.isMobile = true;
				else this.isMobile = false;
			}
		},
		filterList: function(arr) {
			return arr = arr.filter(function (list) {
				return list !== '';
			});
		},
		renderList: function() {
			if (this.isFurniture === true) app.$set(this.listOutput, 1,'Обеспыливаем мебель при необходимости');
			else app.$set(this.listOutput, 1, '');
			if (this.isResidential === true) {
				if(this.wcAmount === 0) app.$set(this.listOutput, 2,'Делаем уборку ' + this.spellcheckEnding(this.listRoow,this.roomAmount,'комнаты','комнат','комнат') + '');
				else app.$set(this.listOutput, 2,'Делаем уборку ' + this.spellcheckEnding(this.listRoow,this.roomAmount,'комнаты','комнат','комнат') + ' и ' +   this.spellcheckEnding(this.listWc,this.wcAmount,'санузла','санузлов','санузлов') + '');
			}
			else {
				app.$set(this.listOutput, 2,'Делаем уборку помещения в ' + this.squareAmount + ' м²');
			}
			this.getTime();
		},
		getTime () {
			this.cleanTime = Math.round(this.defaultPrice / 3000);
			if (this.cleanTime < 4) this.cleanTime = 4;
			if (this.cleanTime > 8) this.realTime = "8+ часов";
			else this.realTime = this.spellcheckEnding(this.realTime, this.cleanTime, 'часа','часа','часов');
		},
	},
	directives: {
		focus: {
			// определение директивы
			inserted: function (el) {
				// Переключаем фокус на элемент
				el.focus();
				// console.log(el);
			},
			// componentUpdated: function(el,binding)	{
			// 	if (binding.value) el.focus();
			// 	else el.blur();
			// },
		},
		maskPhone: {
			bind: function(el) {
				$(el).mask('+7 999 999-99-99',{autoclear: false});
				console.log($(el))
			},
			componentUpdated: function(el)	{
				$(el).mask('+7 999 999-99-99',{autoclear: false});
				console.log($(el))
			},
		}
	},
	mounted: function() {
		this.$nextTick(function () {
			// Код, который будет запущен только после
			// отображения всех представлений
			window.addEventListener('resize', this.stickyButton);

			this.stickyButton();
		  });

		// ловим данные из страницы настроек Вордпресса
		  axios.get(`${global.rest_url}acf/v3/options`)
			  .then((response) => {
				this.optionsWPData = response.data
				// console.log(this.optionsWPData)
			  })
			  .catch(function (error) {
				// handle error
				console.log(error);
			  })
	},
  });

	// Прижимаем подвал к низу экрана
	function stickyFooter() {
		var $footer = $('.footer');
		$footer.siblings('.spacer').remove();
		var contentHeight = $('body').height(),
			windowHeight = $(window).height();
		if(contentHeight < windowHeight) {
			$footer.before('<div class="spacer" style="height: ' + (windowHeight - contentHeight) + 'px;"></div>');
		}
	}