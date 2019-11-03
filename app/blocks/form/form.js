
// class Form{
// 	constructor(form) {
// 		this.form = form;
// 		this.button = this.form.querySelector('button[type="submit"]');
// 		this.fields = this.form.querySelectorAll('input.form__input');
// 		this.url = form.dataset.url;
// 		this.name = this.form.dataset.name;
// 		this.callback = this.form.dataset.callback;

// 		this.events();
// 	}
// 	events() {
// 		let self = this;
// 		const final = document.querySelector('.feedback'),
// 			phone = final.querySelector.querySelector('.feedback__text b');

// 		this.form.addEventListener('submit', function(e) {
// 			e.preventDefault();
// 			self.sendForm();
//         });

//         this.fields.forEach(function(field) {
//         	field.addEventListener('focus', function () {
//         		self.clearError(this);
//         	})
// 		});

// 		this.fields.forEach(function (field) {
// 			field.addEventListener('input', function () {
// 				self.toggleLabel(this);
// 			});
// 		});


// 		 this.fields.forEach(function (field) {
// 			field.addEventListener('keyup', function () {
// 				self.toggleLabel(this);
// 			});
// 		});
// 	}

// 	serialize(form) {
// 		let field, l, s = [];
// 		if (typeof form === 'object' && form.nodeName === "FORM") {
// 			let len = form.elements.length;
// 			for (let i=0; i<len; i++) {
// 				field = form.elements[i];
// 				if (field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button') {
// 					if (field.type === 'select-multiple') {
// 						l = form.elements[i].options.length;
// 						for (let j=0; j<l; j++) {
// 							if(field.options[j].selected)
// 								s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
// 						}
// 					} else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
// 						s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
// 					}
// 				}
// 			}
// 		}
// 		return s.join('&').replace(/%20/g, '+');
// 	}

// 	sendForm() {
// 		let self = this,
// 			tel = this.form.querySelector('input[type="tel"]').value,
// 			params = this.serialize(this.form);

// 		if(self.fieldValid()){
// 			this.button.classList.add('loading');
// 			let request = new XMLHttpRequest();
// 			request.open('POST', this.url, true);
// 			request.onload = () => {
// 				if (request.status >= 200 && request.status < 400) {
// 					this.button.classList.remove('loading');
// 					final.classList.add('visible');
// 					phone.textContent = tel;
// 					self.fields.forEach(field => {
// 						field.value = '';
// 					});
// 				}

// 			};
// 			let callback = eval(this.callback)
// 			if (typeof callback == 'function') {
// 				callback(this)
// 			}
// 			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
// 			request.send(params);
// 		}
// 	}

// 	toggleLabel (field) {
// 		let line = field.closest('.form__line');
// 		if (!!line) line.classList.toggle('opened', field.value.length > 0)
// 	}

// 	checkConfid(checkbox) {
// 		let isChecked = false;
// 		if (!!checkbox.checked) {
// 			this.button.classList.remove('disabled');
// 			isChecked = true;
// 		}
// 		else {
// 			this.button.classList.add('disabled');
// 			isChecked = false;
// 		}

// 		return isChecked;
// 	}

// 	clearField() {
// 		let button = this.form.querySelector('.form__button'),
// 			confident = this.form.querySelector('.form__confidential');
// 		this.fields.forEach(field => {
// 		 	field.value = '';

// 		 	button.style.display = 'block';
// 		 	confident.style.display = 'block';

// 			this.clearError(field);
// 		});
// 	}

// 	clearError(field) {
// 		field.parentElement.classList.remove('error');
// 	}

// 	fieldValid() {
// 		let isValidForm = true;

// 		this.fields.forEach(field => {
// 			this.clearError(field);
// 			let	patternEmail = /^[a-z0-9-._]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i,
// 				type = field.getAttribute('type'),
// 				required = field.required,
// 				isValidField = true,
// 				isFilled,
// 				isEmail;
// 				if (required) {
// 					isFilled = field.value.length > 0;
// 				}
// 				if (type === 'email' && field.value.length > 0) {
// 					isEmail = patternEmail.test(field.value);
// 				}

// 			if(isFilled === false) isValidField = false;
// 			if(isEmail === false) isValidField = false;

// 			if(!isValidField) {
// 				isValidForm = false;
// 				field.parentElement.classList.add('error');
// 			}
// 		});
// 		return isValidForm;
// 	}
// }



// let forms = document.querySelectorAll('form.form');
// forms.forEach(function(form){
// 	new Form(form);
// });
