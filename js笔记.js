/*
 * 第三章:字面量和构造函数
 * js中创建对象的方法及其比较;
 * 创建方法:a.使用构造函数;b.使用对象字面量法;
 */
//a.使用构造函数;
var car = new Object();
car.goes = "far";
car.name = "Porsche";

//b.使用对象字面量法
/*
 *使用对象字面量表示法的语法规则:
 *1.将对象包装在大括号中"{}";
 *2.对象中的属性/方法均用","逗号分隔;
 *3.使用冒号":"来分隔键值对;
 *4.语句完成后,在结尾的"}"后需要添加";";
 */
var car = {goes : "far",name : "Porsche"};
/*
 * 优劣比较:
 * 1.字面量表示法仅需要输入更短的字符;
 * 2.字面量表示法强调了该对象仅是一个可变哈希映射,而不是从对象中提取的属性或方法;
 * 3.字面量表示法与使用构造函数来创建对象来比较,它没有作用域解析的过程(因为可能以同样的名字创建了一个局部构造函数,解释器需要从调用Obejct()的位置开始一直向上查询作用域链,直到发现全局object构造函数);
 * 4.使用构造函数时,构造函数存在一些"特性",可能会因为这样的特性,导致最终返回的值并不是你预想的值;
 */
//针对"特性"的说明实例(反模式/反面教材)

//实例
//一个空对象
var o = new Object();
console.log(o.constructor === Object); //true

//一个数值对象
var o = new Object(1);
console.log(o.constructor === Number); //true
console.log(o.toFixed(2)); //"1.00"

//一个字符串对象
var o = new Object("I am a String!");
console.log(o.constructor === String); //true

//一般的对象并没有substring()方法;
//但字符串对象都有该方法;
console.log(typeof o.substring); // "function"

//一个布尔对象
var o = new Object(true);
console.log(o.constructor === Boolean); //true

/*
 * 如上,当构造函数Obejct()的参数是动态获取的时候,那么返回的结果是与传入的参数息息相关;
 * 得到的结果可能与你设想的不同;
 */


/**************************************************/

/*
 * 除去对象字面量法和内置对的构造函数以为,可以使用自己的构造函数来创建对象(自定义构造函数);
 */
//例如
var Person = function(name){
	this.name = name;
	this.say = function(){
		return "I am "+this.name;
	};
};

/*
 * 上例中,为了简单起见,将say()方法添加到this中,其造成的结果是在任何时候,调用new Person()时都会在内存中创建一个新的函数;
 * 这种方法显然效率低下,因为多个实例之间的say()方法实际上并没有改变;
 * 更好的选择式将方法添加到Person类的原型中;
 */
Person.prototype.say = function(){
	return "I am " + this.name;
};


var adam = new Person("Adam");
adam.say(); //输出结果为"I am Adam"

/**************************************************/

/*在使用构造函数创建对象时,没有指定new 操作符,会使构造函数中的this指向全局对象(在浏览器中,this会指向window)
 * 错误示例:
 */
//构造函数
function Waffle(){
	this.tastes = "yummy";
}

//定义一个新对象
var good_morning = new Waffle();
console.log(typeof good_morning); // "Object"
console.log(good_morning.tastes); // "yummy"


//反模式 忘记使用new操作符了
var good_morning = Waffle();
console.log(typeof good_morning); //"undefined"
console.log(window.tastes); // "yummy"; tastes属性变成全局对象的属性了,不过这个问题在ECMAScript 5得到了解决,并且在严格模式中,this不会指向全局对象;

/**************************************************/
/*
 * 通过一定的命名规则来规避忘记使用new操作符的问题
 * 构造函数的函数名,我们首字母变成大写的(如:MyConstructor),
 * 一般的函数和方法名称中首字母我们使用小写的(如:myFunction);
 * 如此;
 */
/**************************************************/
/*
 * 使用that来替换this;在此处的that变量指示一个泛指,也可以使用别的变量名,比如说self或者是me
 * 这样可以保证构造函数的行为总是表现出构造函数应有的行为;
 * 示例:
 */
function Waffle(){
	var that = {};
	that.tastes = "yummy";
	return that;
}
//甚至,我们可以如下操作,不使用that直接返回一个对象;
function Waffle(){
	return {
		tastes: "yummy"
	};
}
//这样的构造函数,我们在调用时,不论是不是使用了new操作符,属性都不会被指向到全局对象中
var first = new Waffle(),
	second = Waffle();
console.log(first.tastes); //"yummy"
console.log(second.tastes); //"yummy"
//但是,以上的方法却会导致实例对象会丢失到原型的链接,因此任何添加到Waffle()原型的成员,对于对象来说都是不可用的.
//实例:如上的构造函数 Waffle();
Waffle.prototype.price = 15.00;
console.log(first.price); //undefined
//如果是使用了this的则可以在first(实例对象中)访问到原型的链接,如:
function Waf(){
	this.tastes = "yummy";
}

var third = new Waf();
console.log(third.tastes);
Waf.prototype.price = 15.00;
console.log(third.price); //15

/*
 * 那么为了,避免忘记new操作符,而且原型(prototype)属性可以在实例对象中使用以下的方法处理;
 * 首先,我们在构造函数内部判断this对象是否为构造函数的一个实例,如果为否(标明this指向对全局对象)时,我们return 一个带new操作符的构造函数;
 * 实例:
 */
function Waffle(){
	if(!(this instanceof Waffle)){
		return new Waffle();
	}

	this.tastes = "yummy";

}
Waffle.prototype.price = 15;

var first = new Waffle(),
	second = Waffle();

console.log(first.tastes); //"yummy";
console.log(second.tastes); //"yummy";
console.log(first.price); //15;
console.log(second.price); //15;

//在上面的例子中,我们可以使用arguments.callee来替代代码中的硬编码构造函数名称(Waffle写死的构造函数名称)
//如: 该构造函数与上面的构造函数是一致可用的;需要注意的是arguments.callee在ECMAScript5中的严格模式中是被禁用的哦;
function Waffle(){
	if(!(this instanceof arguments.callee)){
		return new arguments.callee;
	}

	this.tastes = "yummy";
}

/**************************************************/

/*
 * 数组也可以使用字面量模式和Array()构造函数的方式来创建数组对象;
 * 如下:
 */
//使用构造函数的方式处理,不推荐使用
var a = new Array("itsy", "bitsy", "spider");

//使用数组字面量法;
var a = ["itsy", "bitsy", "spider"];

console.log(typeof a); //object,这是由于数组本身也是对象类型
console.log(a.constructor === Array); //输出true;

/*
 * 我们不使用构造函数来创建新的数组对象;
 * 因为是我们需要避免构造函数中可能产生的陷阱;
 * 当向Array()构造函数传递单个数字时,它并不会成为第一个数组元素,而是设定了数组的长度;
 * 如下:
 */

var a = [3];
console.log(a.length); //1;
console.log(a[0]); //3;

var a = new Array(3); //其实这是,创建了一个长度为3的数组;
console.log(a.length); //3;
console.log(typeof a[0]); //undefined

var a = [3.14];
console.log(a[0]); //3.14;

var a = new Array(3.14); //报错,不合法的数组长度 RangeError: invalid array length;
console.log(typeof a); //输出"undefined"

//坚持使用数组字面量表示法,程序将会更加安全;

/**************************************************/
/*
 * 检查数组性质;
 * 使用typeof来检测数组时,会返回"object"结果,虽然说这种行为是有意义的,但对于判定数组性质没有什么帮助;
 * 另外,有时,我们会使用一些数组属性或方法,如length,slice()来确定该值是否具有"数组性质"(array-ness);
 * 另外可以使用 instanceof Array来判断,但是,IE的某些版本并不支持;
 * 但是以上方法并不健壮(不能保证百分百准确);
 * 综上,在ECMAScript5中定义了一个新方法Array.isArray()方法来判断值是否是数组;
 */

Array.isArray([]); //true;

//试图以一个类似数组的对象欺骗检查(测试)
Array.isArray({
	length: 1,
	"0": 1,
	slice: function(){}
}); //false

//但是,如果你的环境不支持Array.isArray()这个方法,则可以通过调用Object.prototype.toString()的方法来对其进行检查.

if (typeof Array.isArray === "undefined"){
	Array.isArray = function(arg){
		return Object.prototype.toString.call(arg) === "[object Array]";
	}
}

/**************************************************/
/*
 * 关于JSON,它代表JavaScript对象表示(JavaScript Object Notation)以及数据传输格式;
 * 在JSON中,属性名称需要包装在引号中才能成为合法的JSON;
 * 使用JSON.parse()来处理解析JSON字符串;
 * 例如:
 */
var jstr = '{"mykey": "my value"}';

//反模式
var data = eval('('+jstr+')');

//优先使用的方法
var data = JSON.parse(jstr);

console.log(data.mykey);  //"my value"

//jQuery中的JSON处理方法parseJSON();
var data = jQuery.parseJSON(jstr);
console.log(data.mykey);  //"my value"

//jQuery中还可以通过jQuery.stringify()将任意的对象或者数组序列化为一个JSON字符串;
var dog = {
	name: "Fido",
	dob: new Date(),
	legs: [1,2,3,4,5]
}

var jsonstr = JSON.stringify(dog);
console.log(jsonstr); //"{"name" "Fido","dob": "shijianxxx","legs":"[1,2,3,4,5]" }"

/**************************************************/
/*
 * 正则表达式字面量
 * 如下:
 */
var re = /\\/gm;

//构造函数法
var re = new RegExp("\\\\", "gm");

/**************************************************/
/*
 * 基本值类型包装器
 * JavaScript有五个基本的值类型:
 * 1.数字,2.字符串,3.布尔,4.null,5.undefined.
 * 除了null和undefined外,另外三种具有所谓的基本包装对象(primitive wrapper object).
 * 可以使用内置的构造函数Number(),String(),Boolean()来创建对象.
 * 基本(primitive)数字和数字对象(object)之间的差异
 * 如下:
 */
//一个基本数字
var n = 100;
console.log(typeof n);//"number"

var nobj = new Number(100);
console.log(typeof nobj);//"object"

console.log(n === nobj);//false

/*
 * 包装对象包含了一些方法和属性,比如说数字对象的toFixed()等;
 * 这是使用构造函数来创建对象的一个理由,
 * 然而事实上,在基本值类型上,也能够起作用,就是说,如果,你对某个基本对象调用了这些方法,基本值类型
 * 就可以在后台被临时转换成一个对象
 * 如下:
 */
//用来作为对象的基本字符串
var str = "hello";
console.log(str.toUpperCase()); //"HELLO"

//值本身可以作为一个对象
"monkey".slice(3, 6);//"key"

//一个计算的数值也可以使用数值对象的方法
(22 / 7).toPrecision(3);//"3.14"

/* 所以一般情况下,我们使用字面量法来创建基本值类型即可
 * 但如果你真的需要持久保存状态的需要,则你会需要一个包装对象,使用构造函数来创建一个基本对象;
 * 如下:
 */

//基本字符串
var greet = "Hello World!";

//在使用split()方法,这时,greet从基本类型转换成对象
greet.split(" ")[0];//"Hello"

//为greet这个基本类型添加一个属性,这样是不会报错的
greet.smile = "haha";

//但如果调用这个属性时,则会显示undefined,因为greet是一个基本类型,并不是对象
console.log(greet.smile);//undefined;

//创建一个字符串对象;
var greetobj = new String("Hello World!");

//为greetobj添加一个属性;
greetobj.smile = "haha";

//调用时,是会显示对应的属性值的;
console.log(greetobj.smile); //"haha"

//但上面这种扩充一个基本类型值的方法很少用到,所以创建基本类型值时用字面量法即可;

/**************************************************/
/*
 * 错误对象这块看的不是很明白,待日后再回来看
 */


/**************************************************/
/*
 * 		 				小结
 * a. 对象字面量表示法,他以包装在大括号中的逗号分隔的键-值(key-alue)对的方式来创建对象;
 * b. 构造函数,分类内置构造函数(基本上都有一个对应的字面量表示法)和自定义构造函数;
 * c. 在使用自定义构造函数创建对象时,需要牢记使用new操作符,否则(如果构造函数内使用了this),则会把this指向window对象;
 * d. c中这种漏用new操作符,导致this指向window对象的问题在ECMAScript5中的严格模式会被避免;
 * e. 数组字面量表示发,使用方括号来包括一个个用逗号分隔开的值列表;
 * f. JSON,一种包含对象和数组字面量的数据格式(键值都需要用""引起来);
 * g. 其他;
 */

/**************************************************/
/*
 * 第四章 函数
 * JavaScript中的函数有两个主要特点,使其显得比较特殊.
 * 第一个:函数是第一类对象?(first-class object);
 * 第二个:他们能够提供作用域;
 */
//函数表达式(unnamed),常见的被称为匿名函数(annoymouse function),如下:
//匿名函数存在一个问题,就是该函数对象的name属性为空,这个在递归时是比较有用的.
var add = function(a,b){
	return a+b;
};
console.log(add.name); //空字符串(firebug/chrome);

//命名函数表达式
var add = function add(a,b){
	return a + b;
};
console.log(add.name); //add;

//函数声明(function declaration)
function add(a,b){
	return a + b;
}
console.log(add.name); //add;
