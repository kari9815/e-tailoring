var config = {
    apiKey: "AIzaSyA80u1QNpIVOZ0P_i5cMVM_Ke6CqoYz7bs",
    authDomain: "etailoring-project.firebaseapp.com",
    databaseURL: "https://etailoring-project.firebaseio.com",
    projectId: "etailoring-project",
    storageBucket: "etailoring-project.appspot.com",
    messagingSenderId: "294243724345"
};
firebase.initializeApp(config);
function login() {
    var email = $('#loginemail').val();
    var password = $('#loginpassword').val();
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        window.location.href = 'index.html';
    })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode + " : " + errorMessage);
        });
}
function logout() {
    firebase.auth().signOut().then(function () {
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + " : " + errorMessage);
    });
}
function register() {
    var firstname = $('#First_Name').val();
    var lastname = $('#Last_Name').val();
    var address = $('#Address').val();
    var city = $('#City').val();
    var state = $('#State').val();
    var zip = $('#Zip').val();
    var mobilenumber = $('#Mobile_Number').val();
    var email = $('#Email_Address').val();
    var password = $('#Password').val();
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + uid + '/').set({
            firstname: firstname,
            lastname: lastname,
            address: address,
            city: city,
            state: state,
            zip: zip,
            mobilenumber: mobilenumber,
            email: email,
            uid: uid
        }).then(function (data) {
            window.location.href = 'index.html';
        });
    })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode + " : " + errorMessage);
        });
}
function contactus() {
    var name = $('#contactusname').val();
    var email = $('#contactusemail').val();
    var msg = $('#contactusmsg').val();
    firebase.database().ref('/contactus/').push({
        name: name,
        email: email,
        msg: msg
    }).then(function () {
        alert("done");
        window.location.reload();
    });
}
function feedback() {
    var fname = $('#fname').val();
    var lname = $('#lname').val();
    var email = $('#email').val();
    var comment = $('#comment').val();
    firebase.database().ref('/feedback/').push({
        firstname: fname,
        lastname: lname,
        email: email,
        comment: comment
    }).then(function () {
        alert("DONE");
    });
}
function googlelogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        window.location.href = 'index.html';
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        alert(errorCode + " : " + errorMessage);
    });
}
function facebooklogin() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        window.location.href = 'index.html';
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        alert(errorCode + " : " + errorMessage);
    });
}
function forgotpassword() {
    var email = $('#loginemail').val();
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert('Check Your Email For A Reset Password Link');
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + " : " + errorMessage);
    });
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        $("#header").load("header.html", {}, function (response, status, xhr) {
            $('#loginbutton').hide();
            $('#logoutbutton').show();
            $('#cartbutton').show();
            var uid = firebase.auth().currentUser.uid;
            document.getElementById('useremail').innerHTML = user.email;
            firebase.database().ref('users/' + uid + '/cart').on('value', function (snapshot) {
                try {
                    document.getElementById('cartcount').innerHTML = (Object.keys(snapshot.val()).length);
                } catch (error) {
                }
            })
        });
        $("#footer").load("footer.html");
        if (window.location.pathname.split("/").pop() == 'cart.html') {
            updatecartlist();
        }
        if (window.location.pathname.split("/").pop() == 'wishlist.html') {
            updatewishlist();
        }
        if (window.location.pathname.split("/").pop() == 'orders.html') {
            updateorderslist();
        }
        if (window.location.pathname.split("/").pop() == "productdetails.html") {
            updaterecoms();
        }
        if (window.location.pathname.split("/").pop() == "invoice.html") {
            invoice();
        }
        if (window.location.pathname.split("/").pop() == "checkout.html") {
            if (window.location.hash.substring(1).slice(0, 6) == "custom") {
                updatecheckoutcartcustom();
            } else if (window.location.hash) {
                updatecheckoutcartbuynow();
            } else {
                updatecheckoutcartlist();
            }
        }
    } else {
        $("#header").load("header.html", {}, function (response, status, xhr) {
            $('#loginbutton').show();
            $('#logoutbutton').hide();
            $('#cartbutton').hide();
        });
        $("#footer").load("footer.html");
        if (window.location.pathname.split("/").pop() == "productdetails.html") {
            updaterecoms();
        }
    }
});
var allproducts = ['0010001', '0010002', '0010003', '0010004', '0020001', '0020002', '0020003', '0020004', '0030001', '0030002', '0030003', '0030004', '0040001', '0040002', '0040003', '0040004', '0050001', '0050002', '0050003', '0050004', '0060001', '0060002', '0060003', '0060004', '0070001', '0070002', '0070003', '0070004', '0080001', '0080002', '0080003', '0080004', '0090001', '0090002', '0090003', '0090004', '0100001', '0100002', '0100003', '0100004'];
var data = '';
function updatealldata(category) {
    firebase.database().ref('products/' + category).once('value').then(function (snapshot) {
        snapshot.forEach(function (product) {
            if (allproducts.includes(product.val().productid)) {
                var val = product.val();
                console.log(val);
                firebase.storage().refFromURL('gs://etailoring-project.appspot.com' + product.val().productimage).getDownloadURL().then(function (url) {
                    console.log(product.val().productimage)
                    updateproducts(product.val().productid, url, product.val().productname, product.val().price, product.val().productimage);
                }).catch(function (error) {
                    console.log(error.code + ' : ' + error.message);
                });
            }
        });
    });
}
function updatedata(category) {
    firebase.database().ref('products/' + category).once('value').then(function (snapshot) {
        snapshot.forEach(function (product) {
            var val = product.val();
            console.log(val);
            firebase.storage().refFromURL('gs://etailoring-project.appspot.com' + product.val().productimage).getDownloadURL().then(function (url) {
                updateproducts(product.val().productid, url, product.val().productname, product.val().price, product.val().productimage);
            }).catch(function (error) {
                console.log(error.code + ' : ' + error.message);
            });
        });
    });
}
var categorys = ['men', 'cartoon', 'couple', 'festive', 'foodie', 'funky', 'games', 'women', 'kids', 'relations'];
var categoryid = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'];
var categoryswitch = window.location.hash.substring(1);
if (window.location.pathname.split("/").pop() == 'products.html') {
    if (window.location.hash.substring(1) == "all") {
        data = "";
        for (var i = 0; i < categorys.length; i++) {
            updatealldata(categoryid[i]);
        }
    }
    for (var i = 0; i < categorys.length; i++) {
        if (categoryswitch == (categorys[i])) {
            data = "";
            updatedata(categoryid[i]);
        }
    }
}
if (window.location.pathname.split("/").pop() == 'productdetails.html') {
    /*var pid = window.location.hash.substring(1);
    var category = pid.slice(0, 3);
    var product = pid.slice(3, 8);
    firebase.database().ref('/products/' + category + '/' + product + '/').once('value', function (snapshot) {
        var price = snapshot.val().price;
        var img = snapshot.val().productimage;
        var name = snapshot.val().productname;
        var id = snapshot.val().productid;
        var desc = snapshot.val().productdesc;
        firebase.storage().refFromURL('gs://etailoring-project.appspot.com' + img).getDownloadURL().then(function (url) {
            document.getElementById('productimg').src = url;
            document.getElementById('productname').innerHTML = name;
            document.getElementById('productprice').innerHTML = price;
            document.getElementById('productid').innerHTML = id;
            document.getElementById('productdesc').innerHTML = desc;
        });
    });*/
    showprod();
}
window.onhashchange = function () {
    if (window.location.pathname.split("/").pop() == 'products.html') {
        displaycategory();
    }
    if (window.location.pathname.split("/").pop() == 'productdetails.html') {
        showprod();
    }
}
function displaycategory() {
    var categoryswitch = window.location.hash.substring(1);
    if (window.location.hash.substring(1) == "all") {
        data = "";
        for (var i = 0; i < categorys.length; i++) {
            updatealldata(categoryid[i]);
        }
    }
    for (var i = 0; i < categorys.length; i++) {
        if (categoryswitch == (categorys[i])) {
            data = "";
            updatedata(categoryid[i]);
        }
    }
}
function showprod() {
    var pid = window.location.hash.substring(1);
    var category = pid.slice(0, 3);
    var product = pid.slice(3, 8);
    firebase.database().ref('/products/' + category + '/' + product + '/').once('value', function (snapshot) {
        console.log(snapshot.val());
        var price = snapshot.val().price;
        var img = snapshot.val().productimage;
        var name = snapshot.val().productname;
        var id = snapshot.val().productid;
        var desc = snapshot.val().productdesc;
        var details = snapshot.val().productdetails;
        console.log(details);
        firebase.storage().refFromURL('gs://etailoring-project.appspot.com' + img).getDownloadURL().then(function (url) {
            document.getElementById('productimg').src = url;
            document.getElementById('productname').innerHTML = name;
            document.getElementById('productprice').innerHTML = price;
            document.getElementById('productid').innerHTML = id;
            document.getElementById('productdesc').innerHTML = desc;
            document.getElementById('fitting').innerHTML = details.fitting;
            document.getElementById('frm').innerHTML = details.form;
            document.getElementById('ideal').innerHTML = details.ideal;
            document.getElementById('material').innerHTML = details.material;
            document.getElementById('pack').innerHTML = details.pack;
            document.getElementById('sleeves').innerHTML = details.sleeves;
            document.getElementById('type').innerHTML = details.type;
            document.getElementById('wash').innerHTML = details.wash;
        });
    });
}
function updateproducts(productid, productimageURL, productname, productprice, productimagePATH) {
    data = data + `
        <div class="col-md-3 col-sm-6 mb-3">
            <div class="product-grid6 border border-dark">
                <div class="product-image6">
                    <a href="productdetails.html#` + productid + `"><img class="pic-1" src="` + productimageURL + `"></a>
                </div>
                <div class="product-content">
                    <h3 class="title"><a href="#">` + productname + `</a></h3>
                    <div class="price">Rs.` + productprice + `
                    </div>
                </div>
                <ul class="social">
                    <li><a href="javascript: quickview('` + productid + `','` + productprice + `','` + productimagePATH + `','` + productname + `','` + productimagePATH + `')" data-tip="Quick View"><i class="fas fa-search"></i></a></li>
                    <li><a href="javascript: addtowishlist('` + productid + `');" data-tip="Add to Wishlist"><i class="fas fa-shopping-bag"></i></a></li>
                </ul>
            </div>
        </div>`;
    document.getElementById('row1').innerHTML = data;
}
function quickview(productid, productprice, productimageURL, productname, productimagePATH) {
    console.log(productimagePATH);
    firebase.storage().refFromURL('gs://etailoring-project.appspot.com' + productimagePATH).getDownloadURL().then(function (url) {
        $('#ModalLongTitle').html(productname);
        $('#ModalImage').attr('src', url);
        $('#ModalCenter').modal('show');
    });
}
function addtocart(size, qty, productid) {
    if (size == "invalid") {
        alert("Select A Valid Size!")
    } else {
        var uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + uid + '/cart/' + productid + '/').set({
            size: size,
            product: productid,
            quantity: qty
        }).then(function () {
            alert("DONE")
        });
    }
}
function addtowishlist(productid) {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uid + '/wishlist/' + productid).set({
        product: productid,
        quantity: 1
    });
}
function removewish(prodid) {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + uid + '/wishlist/' + prodid).set({});
    wishdata = "";
    updatewishlist();
}
var wishdata = "";
function updatewishitems(productid, productname, productprice, productqty, productimageURL) {
    console.log(typeof productid);
    console.log(productid);
    wishdata = wishdata + `
    <tr>
    <td onclick = "window.location.href = 'productdetails.html#` + productid + `'"><img src="` + productimageURL + `" width="80" height="80" alt=""></td>
    <td onclick = "window.location.href = 'productdetails.html#` + productid + `'">` + productname + `</td>
    <td onclick = "window.location.href = 'productdetails.html#` + productid + `'" id="price` + productid + `">` + productprice + `</td>
    <td>
        <button class="btn btn-danger" id="` + productid + `" onclick="removewish('` + productid + `');">remove</button>
    </td>
    </tr>
    `;
    document.getElementById('wishlist').innerHTML = wishdata;
}
function updatewishlist() {
    var test = [];
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uid + '/wishlist/').once('value').then(function (snapshot) {
        var snap = snapshot.val();
        if (snap == null) {
            document.getElementById('items').innerHTML = "<tr style='text-align:center;'><td colspan='5' >No items in Wishlist<td></tr>";
        }
        snapshot.forEach(function (products) {
            test.push(1);
            var prod = products.val();
            var prodid = products.val().product;
            var qty = products.val().quantity;
            console.log(prodid)
            var category = prodid.slice(0, 3)
            var product = prodid.slice(3, 8)
            var pid = prodid.slice(0, 8);
            console.log(category + ' : ' + product);
            firebase.database().ref('products/' + category + '/' + product + '/').once('value').then(function (prodsnap) {
                firebase.storage().refFromURL('gs://etailoring-project.appspot.com' + prodsnap.val().productimage).getDownloadURL().then(function (url) {
                    updatewishitems(pid, prodsnap.val().productname, prodsnap.val().price, qty, url);
                }).catch(function (error) {
                    console.log(error.code + ' : ' + error.message);
                });
            }).catch(function (error) {
                console.log(error.code + ' : ' + error.message);
            });
        });
    });
    if (test == []) {
        document.getElementById('items').innerHTML = "";
    }
}
var cartdata = "";
var subtotal = 0;
var shipping = 50;
var discount = 0;
function cartresetvalues() {
    cartdata = "";
    subtotal = 0;
    shipping = 50;
    discount = 0;
}
function updatecartitems(productid, productname, productprice, productqty, productimageURL) {
    cartdata = cartdata + `
    <tr class="product" id="` + productid + `">
    <td><img src="` + productimageURL + `" width="80" height="80" alt="" onclick="window.location.href = 'productdetails#' + ` + productid + `"></td>
    <td>` + productname + `</td>
    <td>
        <input type="number" name="qty" id="qty" value="` + productqty + `" class="form-control qty" min="1" max="5" onchange="changeqty(this.value,'` + productid + `')">
    </td>
    <td class="unitprice" id="unitprice` + productid + `">` + productprice + `</td>
    
    <td class="totalprice" id="totalprice` + productid + `">` + productprice * productqty + `</td>
    <td>
        <p class="btn btn-danger" id="` + productid + `" onclick="removecart('` + productid + `'); cartresetvalues(); updatecartlist();">&times;</p>
    </td>
    </tr>
    `;
    subtotal = subtotal + parseInt(productprice);
    document.getElementById('items').innerHTML = cartdata;
    document.getElementById('subtotal').innerHTML = subtotal;
    document.getElementById('discount').innerHTML = discount;
    document.getElementById('shipping').innerHTML = shipping;
    document.getElementById('total').innerHTML = subtotal + shipping;
}
function updatecartlist(value) {
    var test = [];
    var subtotal = 0;
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uid + '/cart/').once('value').then(function (snapshot) {
        var snap = snapshot.val();
        if (snap == null) {
            document.getElementById('cartcount').innerHTML = '';
            document.getElementById('items').innerHTML = "<tr style='text-align:center;'><td colspan='5' >No items in cart<td></tr>";
            $('#subtotal').html('');
            $('#discount').html('');
            $('#shipping').html('');
            $('#total').html('');
        }
        snapshot.forEach(function (products) {
            test.push(1);
            var prod = products.val();
            var prodid = products.val().product;
            var qty = products.val().quantity;
            console.log(prodid)
            var category = prodid.slice(0, 3)
            var product = prodid.slice(3, 8)
            console.log(category + ' : ' + product);
            firebase.database().ref('products/' + category + '/' + product + '/').once('value').then(function (prodsnap) {
                firebase.storage().refFromURL('gs://etailoring-project.appspot.com' + prodsnap.val().productimage).getDownloadURL().then(function (url) {
                    subtotal = subtotal + (prodsnap.val().price * qty);
                    updatecartitems(prodsnap.val().productid, prodsnap.val().productname, prodsnap.val().price, qty, url);
                    var total = $('.totalprice');
                    var subtotal = 0;
                    console.log(total);
                    for (i = 0; i < total.length; i++) {
                        subtotal = subtotal + parseInt(total[i].innerHTML);
                        console.log(total[i].innerHTML);
                    }
                    document.getElementById('subtotal').innerHTML = subtotal;
                    document.getElementById('shipping').innerHTML = 50;
                    document.getElementById('total').innerHTML = subtotal + 50;
                }).catch(function (error) {
                    console.log(error.code + ' : ' + error.message);
                });
            }).catch(function (error) {
                console.log(error.code + ' : ' + error.message);
            });
        });
    });
    if (test == []) {
        document.getElementById('items').innerHTML = "";
    }
}
function updateorderslist() {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + uid + '/orders/').once('value', function (snapshot) {
        snapshot.forEach(function (data) {
            var val = data.val();
            var custom = data.val().custom;
            console.log(custom);
            //firebase.database().ref('/users/' + uid + '/orders/' + val.key + '/product').once('value',function(prod){
            data.forEach(function (value) {
                if (value.key == "products") {
                    var qty = (Object.keys(value.val()).length);
                    updateordersitems(custom, val.orderid, qty, val.orderstatus, val.orderamount);
                }
            });

        });

    });
}
var orderdata = "";
function updateordersitems(custom, orderid, orderqty, orderstatus, orderamount) {
    //orderqty = 333;
    //console.log(Object.keys(orderqty).length);
    orderdata = orderdata + `
    <tr onclick="orderdetails(` + custom + `,'` + orderid + `',` + orderqty + `,'` + orderstatus + `',` + orderamount + `)">
                        <td><span id="orderid">` + orderid + `</span></td>
                        <td>Items: <span id="orderquantity">` + orderqty + `</span></td>
                        <td><span class="badge badge-pill badge-success" id="orderstatus">` + orderstatus + `</span></td>
                        <td>₹ <span id="orderamount">` + orderamount + `</span>/-</td>
                    </tr>
    `;
    document.getElementById('orders').innerHTML = orderdata;
}
function changeqty(value, pid) {
    var total = 'totalprice' + pid;
    console.log(total);
    var p = 'price' + pid;
    document.getElementById('totalprice' + pid).innerHTML = parseInt(document.getElementById('unitprice' + pid).innerHTML) * value;
    var total = $('.totalprice');
    var subtotal = 0;
    console.log(total);
    for (i = 0; i < total.length; i++) {
        subtotal = subtotal + parseInt(total[i].innerHTML);
        console.log(total[i].innerHTML);
    }
    document.getElementById('subtotal').innerHTML = subtotal;
    document.getElementById('shipping').innerHTML = 50;
    document.getElementById('total').innerHTML = subtotal + 50;
}
function removecart(productid) {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uid + '/cart/' + productid).set({});
}
function orderdetails(custom, orderid, orderqty, orderstatus, orderamount) {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + uid + '/orders/' + orderid + '/products/').once('value', function (snapshot) {
        document.getElementById('oid').innerHTML = orderid;
        document.getElementById('ototal').innerHTML = orderamount;
        document.getElementById('osubtotal').innerHTML = parseInt(orderamount) - 50;
        document.getElementById('oshipping').innerHTML = 50;
        snapshot.forEach(function (products) {
            console.log(products.val());
            if (custom) {
                var val = products.val();
                var prodid = val.productid;
                firebase.database().ref('users/' + uid + '/customization/cart/' + prodid).once('value').then(function (prodsnap) {
                    subtotal = subtotal + prodsnap.val().productprice;
                    updateorderdetails(custom,prodid, prodsnap.val().productimagefront, val.productqty, val.productsize, prodsnap.val().productprice);
                }).catch(function (error) {
                    console.log(error.code + ' : ' + error.message);
                });
            } else {
                var val = products.val();
                var prodid = val.productid;
                var category = prodid.slice(0, 3);
                var productidstring = prodid.slice(0, 8);
                var product = prodid.slice(3, 8);
                console.log(category + ' : ' + product);
                firebase.database().ref('products/' + category + '/' + product + '/').once('value').then(function (prodsnap) {
                    firebase.storage().refFromURL('gs://etailoring-project.appspot.com' + prodsnap.val().productimage).getDownloadURL().then(function (url) {
                        subtotal = subtotal + prodsnap.val().price;
                        updateorderdetails(custom,productidstring, url, val.productqty, val.productsize, prodsnap.val().price);
                    }).catch(function (error) {
                        console.log(error.code + ' : ' + error.message);
                    });
                }).catch(function (error) {
                    console.log(error.code + ' : ' + error.message);
                });
            }
        });
    })
    $('#ModalCenter').modal('show');
}
var ordermodal = "";
function updateorderdetails(custom,productid, productimage, productqty, productsize, productprice) {
    if(custom){
        ordermodal = ordermodal + `
    <tr>
        <td><img src="` + productimage + `" height="60px" width="60px"></td>
        <td>` + productqty + `</td>
        <td>` + productsize + `</td>
        <td>` + productprice + `</td>
    </tr>
    `;
    document.getElementById('ordermodal').innerHTML = ordermodal;
    } else{
    ordermodal = ordermodal + `
    <tr onclick='showproduct("` + productid + `");'>
        <td><img src="` + productimage + `" height="60px" width="60px"></td>
        <td>` + productqty + `</td>
        <td>` + productsize + `</td>
        <td>` + productprice + `</td>
    </tr>
    `;
    document.getElementById('ordermodal').innerHTML = ordermodal;
    }
}
function showproduct(productid) {
    window.location.href = 'productdetails.html#' + productid;
}
function gotorecom(id) {
    var cat = window.location.hash.substring(1).slice(0, 3);
    id = '000' + id.toString();
    var path = cat + id;
    window.location.hash = '#' + path;
    showprod();
}
window.onhashchange = function () {
    displaycategory();
    updaterecoms();
}
if ("onhashchange" in window) {
    window.onhashchange = function () {
        displaycategory();
        showprod();
        updaterecoms();
        recomdata = "";
    }
}
function updaterecoms() {
    var product = window.location.hash.substring(1);
    var category = product.slice(0, 3);
    var recoms = ['0001', '0002', '0003', '0004'];
    recoms.forEach(function (prodid) {
        firebase.database().ref('/products/' + category + '/' + prodid).once('value', function (snapshot) {
            var recomname = snapshot.val().productname;
            firebase.storage().ref('/products/' + category + '/' + category + prodid + '.jpg').getDownloadURL().then(function (url) {
                //console.log(url);
                addrecoms(category, prodid, url, recomname);
            });
        });
    });
}
var recomdata = "";
function addrecoms(recomcat, recomid, recomimg, recomname) {
    recomdata = recomdata + `
<tr class="mb-2">
<td>
    <a href="productdetails.html#` + recomcat + recomid + `">
        <img src="` + recomimg + `" height="80px" width="80px" alt=""
            class="img-thumbnail">
    </a>
</td>
<td class=" ml-1 d-none d-md-block">` + recomname + `</td>
</tr>
`;
    document.getElementById('recommendations').innerHTML = recomdata;
}

/*
* CUSTOMIZATION ....
*/
function frontshot() {
    showfront();
    html2canvas(document.getElementById('frontimg')).then(function (canvas1) {
        var data641 = canvas1.toDataURL();
        $('#frontshot').attr('src', data641);
        backshot();
    });
}
function backshot() {
    showback();
    html2canvas(document.getElementById('backimg')).then(function (canvas2) {
        var data642 = canvas2.toDataURL();
        $('#backshot').attr('src', data642);
        showfront();
    });
}

function showboth() {
    frontshot();
}

function custombuynow() {
    if(firebase.auth().currentUser == null){
        var x = confirm("Please login");
        if(x) window.location.href = 'login.html';
    } else {
    var uid = firebase.auth().currentUser.uid;
    
    var timenow = Date.now();
    var cprice = document.getElementById('cprice').value;
    var cqty = document.getElementById('cqty').value;
    var csize = document.getElementById('csize').value;
    var cimagefront = document.getElementById('frontshot').src;
    var cimageback = document.getElementById('backshot').src;
    firebase.database().ref('/users/' + uid + '/customization/cart/' + timenow).set({
        productprice: cprice,
        productqty: cqty,
        productsize: csize,
        productimagefront: cimagefront,
        productimageback: cimageback
    }).then(function () {
        alert("CHECKOUT NOW");
        window.location.href = "checkout.html#custom" + timenow;
    });
}
}

function showcustombuy() {
    showboth();
    document.getElementById('cprice').value = parseInt(document.getElementById('customprice').innerHTML);
    $('#custombuy').modal().show();
}

var imagetab = true;
var texttab = false;
var front = true;
var back = false;

var fimg = false;
var ftxt = false;
var bimg = false;
var btxt = false;

function showimagetab() {
    $('#texttab').hide();
    $('#imagetab').show();
    $('#customimgfile').show();
    imagetab = true;
    texttab = false;
}
function showtexttab() {
    $('#imagetab').hide();
    $('#texttab').show();
    imagetab = false;
    texttab = true;
    $('#customimgfile').hide();
}
function showback() {
    $('#frontimg').hide();
    $('#backimg').show();
    back = true;
    front = false;
}
function showfront() {
    $('#backimg').hide();
    $('#frontimg').show();
    front = true;
    back = false;
}
function changefilename(id) {
    var fileName = document.getElementById(id).value;
    fileName = fileName.split("\\").pop();
    console.log(fileName);
    document.getElementById('customimglabel').innerHTML = fileName;
}

if (window.location.href.split("/").pop() == "customize.html") {
    interact('.resize-drag-image-front')
        .draggable({
            onmove: window.dragMoveListener,
            modifiers: [
                interact.modifiers.restrict({
                    restriction: 'parent',
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                })
            ]
        })
        .resizable({
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: true, top: true },

            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                    endOnly: true,
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 100 },
                }),
            ],

            inertia: true
        })
        .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);
            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
        });
    interact('.resize-drag-image-back')
        .draggable({
            onmove: window.dragMoveListener,
            modifiers: [
                interact.modifiers.restrict({
                    restriction: 'parent',
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                })
            ]
        })
        .resizable({
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: true, top: true },

            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                    endOnly: true,
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 100 },
                }),
            ],

            inertia: true
        })
        .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);
            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
        });
    interact('.resize-drag-text-front')
        .draggable({
            onmove: window.dragMoveListener,
            modifiers: [
                interact.modifiers.restrict({
                    restriction: 'parent',
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                })
            ]
        })
        .resizable({
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: true, top: true },

            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                    endOnly: true,
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 30 },
                }),
            ],

            inertia: true
        })
        .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);
            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
        });
    interact('.resize-drag-text-back')
        .draggable({
            onmove: window.dragMoveListener,
            modifiers: [
                interact.modifiers.restrict({
                    restriction: 'parent',
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                })
            ]
        })
        .resizable({
            // resize from all edges and corners
            edges: { left: true, right: true, bottom: true, top: true },

            modifiers: [
                // keep the edges inside the parent
                interact.modifiers.restrictEdges({
                    outer: 'parent',
                    endOnly: true,
                }),

                // minimum size
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 30 },
                }),
            ],

            inertia: true
        })
        .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);
            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
        });
}
function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

function drawtext() {
    if (front) {
        var tCtx = document.getElementById('textCanvas').getContext('2d'), //Hidden canvas
            imageElem = document.getElementById('image-front'); //Image element
        // Text input element
        var textvalue = document.getElementById('customtext').value;
        tCtx.canvas.width = tCtx.measureText(textvalue).width;
        //tCtx.font = '30px Arial'
        //tCtx.font = toString('30px ' + document.getElementById('font').value);
        tCtx.font = getfont();
        tCtx.fillStyle = getfontcolor();
        tCtx.fillText(textvalue, 0, 50);
        imageElem.src = tCtx.canvas.toDataURL();
        console.log(imageElem.src);
        $('.resize-drag-text-front').show();
        ftxt = true;
        calculateprice();
    }

    if (back) {
        var tCtx = document.getElementById('textCanvas').getContext('2d'), //Hidden canvas
            imageElem = document.getElementById('image-back'); //Image element
        // Text input element
        var textvalue = document.getElementById('customtext').value;
        tCtx.canvas.width = tCtx.measureText(textvalue).width;
        //tCtx.font = '30px Arial'
        //tCtx.font = toString('30px ' + document.getElementById('font').value);
        tCtx.font = getfont();
        tCtx.fillStyle = getfontcolor();
        tCtx.fillText(textvalue, 0, 50);
        imageElem.src = tCtx.canvas.toDataURL();
        console.log(imageElem.src);
        $('.resize-drag-text-back').show();
        btxt = true;
        calculateprice();
    }

}
function initializetext() {
    if (front) {
        var tCtx = document.getElementById('textCanvas').getContext('2d'), //Hidden canvas
            imageElem = document.getElementById('image-front'); //Image element
        // Text input element
        var textvalue = document.getElementById('customtext').value;
        tCtx.canvas.width = tCtx.measureText(textvalue).width;
        //tCtx.font = '30px Arial'
        //tCtx.font = toString('30px ' + document.getElementById('font').value);
        tCtx.font = getfont();
        tCtx.fillStyle = getfontcolor();
        tCtx.fillText(textvalue, 0, 50);
        imageElem.src = tCtx.canvas.toDataURL();
        console.log(imageElem.src);
    }

    if (back) {
        var tCtx = document.getElementById('textCanvas').getContext('2d'), //Hidden canvas
            imageElem = document.getElementById('image-back'); //Image element
        // Text input element
        var textvalue = document.getElementById('customtext').value;
        tCtx.canvas.width = tCtx.measureText(textvalue).width;
        //tCtx.font = '30px Arial'
        //tCtx.font = toString('30px ' + document.getElementById('font').value);
        tCtx.font = getfont();
        tCtx.fillStyle = getfontcolor();
        tCtx.fillText(textvalue, 0, 50);
        imageElem.src = tCtx.canvas.toDataURL();
        console.log(imageElem.src);
    }

}

function addimg(src) {
    if (front) {
        document.getElementById('dragimg-front').src = src;
        $('.resize-drag-image-front').show();
        fimg = true;
        calculateprice();
    }
    if (back) {
        document.getElementById('dragimg-back').src = src;
        $('.resize-drag-image-back').show();
        bimg = true;
        calculateprice();
    }
}


$('#customimgfile').on('change', function (e) {
    console.log(e);
    $('#customimgfile').val() = e.target.files[0].name;
    addimg(e.target.files[0])
});

function getfont() {
    var font = document.getElementById('font').value;
    return (`60px ` + font);
}

function getfontcolor() {
    var color = document.getElementById('color').value;
    return (color);
}

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        console.log(reader.result);
        addimg(reader.result)
    }
    reader.readAsDataURL(file);
}


function choosecolor(id) {
    var path = './assets/images/blank_tees/';
    document.getElementById('frontcontainer').style.backgroundImage = "url('" + path + 'front/' + id + '.jpg' + "')";
    document.getElementById('backcontainer').style.backgroundImage = "url('" + path + 'back/' + id + '.jpg' + "')";
}

function clearimg() {
    if (front) {
        $('.resize-drag-image-front').hide();
        fimg = false;
        calculateprice();
    }
    if (back) {
        $('.resize-drag-image-back').hide();
        bimg = false;
        calculateprice();
    }

}
function cleartext() {
    if (front) {
        $('.resize-drag-text-front').hide();
        ftxt = false;
        calculateprice();
    }
    if (back) {
        $('.resize-drag-text-back').hide();
        btxt = false;
        calculateprice();
    }

}

function calculateprice(){
    var price = 400;
    if(fimg) price = price + 150;
    if(bimg) price = price + 150;
    if(ftxt) price = price + 100;
    if(btxt) price = price + 100;
    document.getElementById('customprice').innerHTML = price;
}

var checkoutcarttotal = 0;
var checkoutcart = "";
function updatecheckoutcartitems(prodid, prodname, prodimg, prodsize, prodqty, prodprice) {
    console.log(prodsize)
    checkoutcart = checkoutcart + `
    
    <li class="list-group-item d-flex justify-content-between lh-condensed">
    <img src="` + prodimg + `" height="45px" class="d-inline" alt="">
    <div class="d-inline w-100 mx-3">
        <h6 class="my=0">` + prodname + `</h6>
        <small class="text-muted">Size: <span class="checksize">` + prodsize + `</span> | Qty: <span class="checkqty">` + prodqty + `</span><span class="checkid" hidden>` + prodid + `</span></small>
    </div>
    <span class="text-muted">` + prodprice + `</span>
</li>
    `;
    checkoutcarttotal = checkoutcarttotal + (prodprice * prodqty);
    document.getElementById('checkoutcart').innerHTML = checkoutcart;
    document.getElementById('checkoutcarttotal').innerHTML = checkoutcarttotal + 50;
}
function updatecheckoutcartlist() {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + uid + '/cart/').once('value', function (snapshot) {
        console.log(snapshot.val())
        snapshot.forEach(function (prod) {
            var prodid = prod.val().product;
            var qty = prod.val().quantity;
            var size = prod.val().size;
            var category = prodid.slice(0, 3);
            var product = prodid.slice(3, 8);
            firebase.database().ref('users/' + uid + '/cart').on('value', function (snapshot) {
                try {
                    console.log(Object.keys(snapshot.val()).length);
                    document.getElementById('checkoutcartcount').innerHTML = (Object.keys(snapshot.val()).length);
                } catch (error) {
                }
            })
            firebase.database().ref('products/' + category + '/' + product + '/').once('value', function (prodsnap) {
                var prodid = prodsnap.val().productid;
                var prodimg = prodsnap.val().productimage;
                var prodname = prodsnap.val().productname;
                var prodprice = prodsnap.val().price;
                firebase.storage().ref(prodimg).getDownloadURL().then(function (url) {
                    updatecheckoutcartitems(prodid, prodname, url, size, qty, prodprice)
                });
            });
        });
    }).then(function () {
    });
}
function checkout() {
    var uid = firebase.auth().currentUser.uid;
    var timenow = Date.now();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var address1 = $('#address1').val();
    var address2 = $('#address2').val();
    var country = $('#country').val();
    var state = $('#state').val();
    var zip = $('#zip').val();
    var phone = $('#phone').val();
    var custom = false;
    if (window.location.hash.substring(1).slice(0, 6) == 'custom') { custom = true; }
    else { custom = false; }
    var orderamt = $('#checkoutcarttotal').html();
    var payment = $("input[name='paymentMethod']:checked").val();
    firebase.database().ref('users/' + uid + '/orders/' + timenow).set({
        orderid: timenow,
        firstname: firstname,
        lastname: lastname,
        address1: address1,
        address2: address2,
        country, country,
        state: state,
        zip: zip,
        phone: phone,
        payment: payment,
        products: "",
        orderstatus: "Processing",
        orderamount: orderamt,
        custom: custom
    }).then(function () {
        console.log('DONEE');
        var checkoutprods = $('.checkid');
        var checkoutqty = $('.checkqty');
        var checkoutsize = $('.checksize');
        for (var i = 0; i < checkoutprods.length; i++) {
            var id = checkoutprods[i].innerHTML;
            var size = checkoutsize[i].innerHTML;
            var qty = checkoutqty[i].innerHTML;
            firebase.database().ref('users/' + uid + '/orders/' + timenow + '/products/' + id).set({
                productid: id,
                productqty: qty,
                productsize: size
            }).then(function () {

            });
        }
        if (window.location.hash.substring(1).slice(0, 6) == 'custom') {
            window.location.href = 'invoice.html#custom' + timenow;
        } else {
            window.location.href = 'invoice.html#' + timenow;
        }
    });
}

function updatecheckoutcartbuynow() {
    var uid = firebase.auth().currentUser.uid;
    var prodid = window.location.hash.substring(1);
    firebase.database().ref('/users/' + uid + '/buynow/' + prodid).on('value', function (snapshot) {
        var qty = snapshot.val().quantity;
        var size = snapshot.val().size;
        var category = prodid.slice(0, 3);
        var product = prodid.slice(3, 8);
        document.getElementById('checkoutcartcount').innerHTML = 1;
        firebase.database().ref('products/' + category + '/' + product + '/').once('value', function (prodsnap) {
            var prodid = window.location.hash.substring(1);
            var prodimg = prodsnap.val().productimage;
            var prodname = prodsnap.val().productname;
            var prodprice = prodsnap.val().price;
            firebase.storage().ref(prodimg).getDownloadURL().then(function (url) {
                updatecheckoutcartitems(prodid, prodname, url, size, qty, prodprice)
            });
        });
    });
}
function updatecheckoutcartcustom() {
    var uid = firebase.auth().currentUser.uid;
    var timenow = window.location.hash.substring(1).slice(6);
    firebase.database().ref('/users/' + uid + '/customization/cart/' + timenow).once('value', function (snapshot) {
        var qty = snapshot.val().productqty;
        var size = snapshot.val().productsize;
        var img = snapshot.val().productimagefront;
        var price = snapshot.val().productprice;
        document.getElementById('checkoutcartcount').innerHTML = 1;
        var prodname = "Customized Product";
        updatecheckoutcartitems(timenow, prodname, img, size, qty, price)
    });
}

function buynow(prodid, size, qty) {
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + uid + '/buynow/' + prodid).set({
        productid: prodid,
        size: size,
        quantity: qty
    }).then(function () {
        window.location.href = "checkout.html#" + prodid;
    });
}

function invoice() {
    if (window.location.hash.substring(1).slice(0, 6) == 'custom') {
        var orderid = window.location.hash.substring(1).slice(6)
    } else {
        var orderid = window.location.hash.substring(1);
    }
    var uid = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + uid + '/orders/' + orderid).once('value', function (snapshot) {
        firebase.database().ref('/users/' + uid).once('value', function (usersnap) {
            var email = usersnap.val().email;
            var address1 = snapshot.val().address1;
            var address2 = snapshot.val().address2;
            var country = snapshot.val().country;
            var state = snapshot.val().state;
            var zip = snapshot.val().zip;
            var orderamount = snapshot.val().orderamount;
            var orderstatus = snapshot.val().orderstatus;
            var orderid = snapshot.val().orderid;
            var phone = snapshot.val().phone;
            var firstname = snapshot.val().firstname;
            var lastname = snapshot.val().lastname;
            document.getElementById('firstname').innerHTML = firstname;
            document.getElementById('lastname').innerHTML = lastname;
            document.getElementById('phone').innerHTML = phone;
            document.getElementById('orderid').innerHTML = orderid;
            document.getElementById('orderstatus').innerHTML = orderstatus;
            document.getElementById('subtotal').innerHTML = parseInt(orderamount) - 50;
            document.getElementById('orderamount').innerHTML = parseInt(orderamount);
            document.getElementById('zip').innerHTML = zip;
            document.getElementById('state').innerHTML = state;
            document.getElementById('country').innerHTML = country;
            document.getElementById('address2').innerHTML = address2;
            document.getElementById('address1').innerHTML = address1;
            document.getElementById('email').innerHTML = email;
            if (window.location.hash.substring(1).slice(0, 6) == 'custom') {
                snapshot.forEach(function (snap) {
                    if (snap.key == 'products') {
                        snap.forEach(function (products) {
                            var prod = products.val();
                            var prodid = products.val().productid;
                            var prodqty = products.val().productqty;
                            var prodsize = products.val().productsize;
                            firebase.database().ref('/users/' + uid + '/customization/cart/' + prodid + '/').once('value', function (pro) {
                                var prodprice = pro.val().productprice;
                                var prodname = 'Customized Product';
                                console.log(prodname)
                                updateinvoiceitems(prodid, prodqty, prodsize, prodprice, prodname);
                            });

                        });
                    }
                });
            } else {
                snapshot.forEach(function (snap) {
                    if (snap.key == 'products') {
                        snap.forEach(function (products) {
                            var prod = products.val();
                            var prodid = products.val().productid;
                            var prodqty = products.val().productqty;
                            var prodsize = products.val().productsize;
                            var cat = products.val().productid.slice(0, 3);
                            var prod = products.val().productid.slice(3, 8);
                            firebase.database().ref('/products/' + cat + '/' + prod).once('value', function (pro) {
                                var prodprice = pro.val().price;
                                var prodname = pro.val().productname;
                                console.log(prodname)
                                updateinvoiceitems(prodid, prodqty, prodsize, prodprice, prodname);
                            });

                        });
                    }
                });
            }
        });
    });
}
var sr = 0;
var invoicedata = ""
function updateinvoiceitems(pid, pq, ps, pp, pn) {
    sr++;
    invoicedata = invoicedata + `
    
    <tr>
    <td class="center" id="` + pid + `">` + sr + `</td>
    <td class="left strong">` + pn + `</td>

    <td class="right">` + pp + `</td>
    <td class="center">` + pq + `</td>
    <td class="right">` + pp * pq + `</td>
</tr>
`;
    document.getElementById('invoicedata').innerHTML = invoicedata;
}
function buycart() {
    var qty = $('.qty');
    var uid = firebase.auth().currentUser.uid;
    $('.product').each(function (index) {
        var pid = ($(this).attr('id'));
        firebase.database().ref('/users/' + uid + '/cart/' + pid).update({
            quantity: qty[index].value
        }).then(function () {
            console.log('QUANTITY UPDATED');
        });
    });
    window.location.href = "checkout.html";

    /*firebase.database().ref('/users/' + uid + '/cart/' + ).set({

    });
*/

}