/**
 * SVG 基础封装
 * author: Jin
 * 2016-07-08
 * 
 * 定义：假如把 Spider 比喻为一张蜘蛛网 ， 那么 Insect 就是粘在网上的害虫
 */

/**
 * [Spider svg域管理器]
 * @param {[type]} context [svg dom]
 * @param {[type]} svgns   [svg namespaceURI]
 * @param {[type]} prename   [insect name 前缀]
 */
function Spider(context , svgns , prename){
	this.context = context;
	this.svgns = svgns ? svgns : context.namespaceURI;
	this.childrens = {};
	this.current = 0;
	this.prename = !!prename ? prename : 'insect_';
	this.spidername = this.random();
};
/**
 * [random Spider唯一码生成器]
 * @return {[type]} [description]
 */
Spider.random = function(){
	var count = 0 , 
		spidername = 'spider_svg_';
	return function(){
		return spidername+(count++)+'_'+(+new Date());
	}
};
/**
 * [prototype Spider 原型方法]
 * @type {Object}
 */
Spider.prototype = {
	/**
	 * [use 需要使用的 Insect]
	 * @param  {[String]} name [def时输入的名称]
	 * @return {[type]}      [description]
	 */
	use : function(name){
		return this.childrens[name];
	},
	/**
	 * [random 获取Spider唯一码]
	 * @type {[String]}
	 */
	random : Spider.random(),
	/**
	 * [def 定义图形]
	 * @param  {[String | Object]} name   [名称]
	 * @param  {[String]} _class [定义图形的类型]
	 * @param  {[Boolean]} add    [默认是否添加到svg]
	 * @return {[Insect]}        [返回害虫]
	 *
	 * eq:
	 *   def('path') | def('myCircle','path') | def('path',true) | def('myCircle','path',true)
	 */
	def : function(name , _class , add){
		if ( arguments.length === 1 && !!name && this.isType(name ,'string') ){
			_class = name;
			name = this.gName();
		}else if( arguments.length === 2 && this.isType(_class ,'boolean') ){
			add = _class;
			_class = name;
			name = this.gName();
		}

		if ( typeof name === 'object' ){
			_class = name;
			name = this.gName();
			this.childrens[name] = new Insect(_class ,name);
		}else if( !!name && this.isType(name ,'string') ){
			_class = this.isInsect(_class) ? _class.gInsect() : _class;
			this.childrens[name] = new Insect(typeof _class === 'object' ? 
												_class : this.cElement(_class) ,name);
		}else{
			throw new Error('Spider init error');
		}
		
		if ( add ) {
			this.add(name);
		}
		return this.use(name);
	},
	/**
	 * [gName 获取默认Spider提供的名称]
	 * @return {[type]} [description]
	 */
	gName : function(){
		return this.prename+(this.current++);
	},
	/**
	 * [add 添加到SVG中]
	 * @param {[Object | Insect | String | Array]} name [需要添加到svg的元素]
	 */
	add : function(name){
		if ( typeof name === 'object' ) {
			this.append(name);
		}else if ( !!name && this.isType(name , 'string') ){
			this.append(this.childrens[name]);
		}else if ( this.isType(name , 'array')){
			for (var i = 0; i < name.length; i++) {
				this.append(name[i]);
			}
		}
		return this;
	},
	/**
	 * [pop 将元素从Spider中移除insect 但不销毁]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	pop : function(name){
		var insect = null;
		if ( !name ) { return insect};
		if( this.isInsect(name) ){
			name = name.gName();
		}
		insect = this.use(name);
		this.remove(name);
		return insect;
	},
	/**
	 * [destory 销毁元素]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	destory : function(name){
		this.pop(name);
		return this;
	},
	/**
	 * [remove 重svg中移除insect]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	remove : function(name){
		this.context.removeChild(this.childrens[name].gInsect());
		delete this.childrens[name];
		return this;
	},
	/**
	 * [append 添加dom动作]
	 * @param  {[type]} child [Insect |Object]
	 * @return {[type]}       [description]
	 */
	append : function(child){
		if ( this.isInsect(child) ) {
			if ( !this.childrens[child.gName()] ) { 
				child = this.def(child.gName() ,child.gInsect());
			}
			this.context.appendChild(child.gInsect());
		}else {
			this.context.appendChild(child);
		}
		return this;
	},
	/**
	 * [cElement 创建元素]
	 * @param  {[String]} _class [元素名称]
	 * @return {[type]}        [description]
	 */
	cElement : function(_class){
		return window.document.createElementNS(this.svgns , _class);
	}
};

/**
 * [Insect 害虫：单个图形的操作]
 * @param {[type]} insect [description]
 * @param {[type]} name   [description]
 */
function Insect(insect , name){
	this.insect = insect;//dom元素
	this.insectName = name;//名称
	this.attr({'insect':name});//显示的设置到dom元素
};
/**
 * [prototype 害虫]
 * @type {Object}
 */
Insect.prototype = {
	/**
	 * [attr 属性设置，获取]
	 * @param  {[Object | String | function]} attrs [description]
	 * @param  {[String | function]} val   [description]
	 * @return {[type]}       [description]
	 */
	attr : function(attrs, val){
		if ( this.isType(attrs , 'function') ) {
			attrs = attrs(); 
		}
		if ( this.isType(val , 'function') ) {
			val = val();
		}
		if ( arguments.length === 1 ) {
			if ( this.isType(attrs , 'string') ) { 
				return !!attrs ? this.gInsect().getAttribute(attrs) : null;
			}
			for( var attr in attrs ) {
				if ( attrs[attr]) {
					this.gInsect().setAttribute(attr,attrs[attr]);
				}
			}
		}else if ( arguments.length === 2 && this.isType(attrs , 'string') 
										&& this.isType(val , 'string') ) {
			this.gInsect().setAttribute(attrs, val);
		}
		return this;
	},
	/**
	 * [isType 类型判断]
	 * @param  {[target]}  obj  [目标]
	 * @param  {[String]}  type [需要判断的类型]
	 * @return {Boolean}      [true | false]
	 */
	isType : function(obj , type){
		type = type.substring(0, 1).toUpperCase() + type.substr(1);
		return ({}).toString.call(obj) === '[object '+type+']' ? true : false;
	},
	/**
	 * [gInsect 获取原始Dom节点]
	 * @return {[type]} [description]
	 */
	gInsect : function(){
		return this.insect;
	},
	/**
	 * [gName 返回名字]
	 * @return {[type]} [description]
	 */
	gName : function(){
		return this.insectName;
	},
	/**
	 * [isInsect 判断是不是 Insect]
	 * @param  {[type]}  insect [description]
	 * @return {Boolean}        [description]
	 */
	isInsect : function(insect){
		return insect instanceof Insect;
	},
	/**
	 * [append 添加子元素]
	 * @param  {[type]} child [description]
	 * @return {[type]}       [description]
	 */
	add : function(child){
		if ( this.isType(child , 'array') ){
			for (var i = 0; i < child.length; i++) {
				this.append(child[i]);
			}
		}else if ( typeof child === 'object' ){
			this.append(child);
		}
		return this;
	},
	/**
	 * [text 设置文本]
	 * @param  {[String]} txt [description]
	 * @return {[type]}     [description]
	 */
	text : function(txt){
		if ( this.gInsect().textContent !== void 0 && !!txt && this.isType(txt , 'string') ) {
			this.gInsect().textContent = txt;
		}
		return this;
	},
	/**
	 * [remove 删除元素]
	 * @param  {[Node]} child [dom element]
	 * @return {[type]}       [description]
	 */
	remove : function(child){
		this.gInsect().removeChild(child);
		return this;
	},
	/**
	 * [append 添加元素操作]
	 * @param  {[type]} child [description]
	 * @return {[type]}       [description]
	 */
	append : function(child){
		if ( this.isInsect(child) ) {
			this.gInsect().appendChild(child.gInsect());
		}else {
			this.gInsect().appendChild(child);
		}
		return this;
	}
};

Spider.prototype.isType = Insect.prototype.isType;
Spider.prototype.isInsect = Insect.prototype.isInsect;
