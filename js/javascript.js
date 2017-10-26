var customer_id    = null;
var arr            = [];
var arrIdProduct   = [];
var arrnameproduct = [];
var quantity       = 1;
var paymentMethod  = "cashondelivery";
var shippingMethod = 1;
var storedId       = 1;
var createorder    = 1;
$(window).load(function () {
  // do something
  
  getCustomer();
});

function myFunctionCustomer() {
  var x = document.getElementById("div_customer");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
  else {
    x.style.display = "none";
  }
}

function myFunctionCheckout() {
  var x = document.getElementById("myDiv_checkout");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
  else {
    x.style.display = "block";
  }
}

function load_data() {
  var text = '';
  $.post("http://mage1.dev/createorder",
         {
           customer_id   : customer_id,
           storedId      : storedId,
           arrIdProduct  : arrIdProduct,
           quantity      : quantity,
           paymentMethod : paymentMethod,
           shippingMethod: shippingMethod
    
         }, function (data) {
      data.forEach(function (d) {
        text +=
          `<p><input type="radio" name="shippingMethod" value="${d.code}"><b>Code: ${d.code}</b> <br/>Carrier_title: ${d.carrier_title} &nbsp ${d.method_title}<br/> Price: ${d.price}</p>`;
        $(".demo-post").html(text);
      })
    }
  );
  
}

function createOrder() {
  var text = '';
  $.post("http://mage1.dev/createorder",
         {
           customer_id   : customer_id,
           storedId      : storedId,
           arrIdProduct  : arrIdProduct,
           quantity      : quantity,
           paymentMethod : paymentMethod,
           shippingMethod: shippingMethod,
           creatorder    : createorder
    
         }, function (data) {
      data.forEach(function (d) {
//          console.log("ssssss");
        
        $(".demo-post").html("susscess");
      })
    }
  );
  
}

$('.demo-post').on('change', function () {
  var val = $('input[name=shippingMethod]:checked').val();
  
  jQuery("#shipping-method").html(val);
  shippingMethod = val;
});

function getCustomer() {
  customertable.clear();
  jQuery.ajax({
                type    : "GET", //phuong thuc lay data
                dataType: "html", //data tra ve dang html
                url     : "http://mage1.dev/index.php/helloworld/index/customer",
                data    : {}
              }).done(function (html) {
    var returnMsg = jQuery.parseJSON(html); //ép kiểu
//            console.log(typeof returnMsg)
    customerData = prepareDataForCustomerTable(returnMsg);
    customertable.rows.add(customerData); // Add new data
    customertable.columns.adjust().draw(); // Redraw the DataTable
  });
}

//    function toObject(arr) {
//        var rv = {};
//        for (var i = 0; i < arr.length; ++i)
//            rv[i] = arr[i];
//        return rv;
//    }

function prepareDataForCustomerTable(customers) {
//        console.log(customers);
  var data = [];
  if (customers == null) {
    return []
  }
  ;

//        customers = toObject(customers);
//        console.log(typeof customers);
  jQuery.each(customers, function (kos, customer) {
    //push cac attribute cua doi tuong vao mang
    //mang cac doi tuong.
    data.push([
                customer.entity_id,
                customer.firstname,
                customer.lastname,
                customer.email,
                customer.group_id,
                customer.shipping_street,
                customer.billing_city,
                customer.shipping_telephone
              ]);
  });
  customerData = data;
  return data;
}

function format1(d) {
  // `d` is the original data object for the row
  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; background: tomato">' +
         '<tr>' +
         '<td><strong>Entity_id:</strong></td>' +
         '<td>' + d[0] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>First Name:</strong></td>' +
         '<td>' + d[1] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Last Name:</strong></td>' +
         '<td>' + d[2] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Email:</strong></td>' +
         '<td>' + d[3] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Group_ID:</strong></td>' +
         '<td>' + d[4] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Shipping_Street:</strong></td>' +
         '<td>' + d[5] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Billing_City:</strong></td>' +
         '<td>' + d[6] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Shipping_Telephone:</strong></td>' +
         '<td>' + d[7] + '</td>' +
         '</tr>' +
         '</table>';
}

$(document).ready(function () {
  customertable = $('#customer').DataTable({
                                             "searching"     : true,
                                             'bSort'         : false,
                                             'aoColumns'     : [
                                               {sWidth: "10%", bSearchable: true, bSortable: false},
                                               {sWidth: "10%", bSearchable: true, bSortable: false},
                                               {sWidth: "20%", bSearchable: true, bSortable: false},
      
                                               {
                                                 "className"     : 'details-control',
                                                 "orderable"     : false,
                                                 "data"          : null,
                                                 "defaultContent": ''
                                               },
                                               {
                                                 "className"     : 'select-customer',
                                                 "orderable"     : false,
                                                 "data"          : null,
                                                 "defaultContent": "<button onclick='myFunctionCheckout()' style='background-color: #d4d4aa'>Select Customer</button>"
                                               }
                                             ],
                                             "scrollCollapse": true,
                                             "info"          : true,
                                             "paging"        : true
    
                                           });
});

// Add event listener for opening and closing details
$('#customer').on('click', '.details-control', function () {//bat su kien onclick
  var tr  = $(this).closest('tr'); //chon thanh phan tr.
  var row = customertable.row(tr);
  console.log(row.data());
  
  if (row.child.isShown()) {//kiem tra neu row.child.isShown thi hide
    // This row is already open - close it
    row.child.hide();
    tr.removeClass('shown');
  }
  else {
    // nguoc lai thi shown
    // Open this row
    row.child(format1(row.data())).show();
    tr.addClass('shown');
  }
});
// choose customer
$('#customer').on('click', '.select-customer', function () {
  var tr      = $(this).closest('tr');
  var row     = customertable.row(tr);
  customer_id = row.data()[0];
  var email   = row.data()[3];
  
  console.log(email);
  jQuery("#email-customer").html(email);
  jQuery("#customer-id").html(customer_id);
  var storeID = 1;
  jQuery("#storeid").val(storeID);
  
})

jQuery("#product-quanity").html(quantity);
jQuery("#payment-method").html(paymentMethod);
jQuery("#shipping-method").html(shippingMethod);
jQuery("#stored-id").html(storedId);

$(window).load(function () {
  producttable.clear();
  getProduct();
})

function myFunctionProduct() {
  var x = document.getElementById("myDiv_product");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
  else {
    x.style.display = "none";
  }
}

function getProduct() {
  producttable.clear();
  jQuery.ajax({
                type    : "GET",
                dataType: "html", //
                url     : "http://mage1.dev/index.php/helloworld/index/product",
                data    : {}
              }).done(function (html) {
    var returnMsg = jQuery.parseJSON(html);
    productData   = prepareDataForProductTable(returnMsg);
    producttable.rows.add(productData);
    producttable.columns.adjust().draw();
    
  })
}

//    function toObject(arr) {
//        var rv ={};
//        for (var i =0;i<arr.length;++i)
//            rv[i] =arr[i];
//        return rv;
//
//    }
function prepareDataForProductTable(product) {
  var data = [];
  if (product == null) {
    return []
  }
//        product =toObject(product);
  jQuery.each(product, function (kos, pro) {
    data.push([
                //push cac attribute cua doi tuong vao mang
                //mang cac doi tuong.
                pro.entity_id,
                pro.type_id,
                pro.name,
                pro.sku,
                pro.price
    
              ])
    
  })
  productData = data;
  //console.log(productData);
  return data;
}

$(document).ready(function () {
  producttable = $('#product').DataTable({
         "searching"     : true,
         'bSort'         : false,
         'aoColumns'     : [
           {bSearchable: true, bSortable: false},
           {bSearchable: true, bSortable: false},
           {bSearchable: true, bSortable: false},
           {bSearchable: true, bSortable: false},
           {bSearchable: true, bSortable: false},
           {
             "className"     : 'details-control',
             "orderable"     : false,
             "data"          : null,
             "defaultContent": ''
           },
           {
             "className"     : 'add-to-cart',
             "orderable"     : false,
             "data"          : null,
             "defaultContent": "<button style='background-color: #d4d4aa'>Add To Cart</button>"
           }

         ],
         "scrollCollapse": true,
         "info"          : true,
         "paging"        : true

       });
});

function format(d) {
  // `d` is the original data object for the row
  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; background: tomato">' +
         '<tr>' +
         '<td><strong>Entity_ID:</strong></td>' +
         '<td>' + d[0] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Type_ID:</strong></td>' +
         '<td>' + d[1] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Name:</strong></td>' +
         '<td>' + d[2] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>SKU:</strong></td>' +
         '<td>' + d[3] + '</td>' +
         '</tr>' +
         '<tr>' +
         '<td><strong>Price:</strong></td>' +
         '<td>' + d[4] + '</td>' +
         '</tr>' +
         '</table>';
}

$('#product').on('click', '.details-control', function () {
  var tr = $(this).closest('tr');
  
  var row = producttable.row(tr);
  console.log(row);
//        console.log(row.data());
  
  if (row.child.isShown()) {
    // This row is already open - close it
    row.child.hide();
    tr.removeClass('shown');
  }
  else {
    // Open this row
    row.child(format(row.data())).show();
    tr.addClass('shown');
  }
});
$('#product').on('click', '.add-to-cart', function () {
  
  var tr        = $(this).closest('tr');
  var row       = producttable.row(tr);
  var obj       = new Object();
  obj.entity_id = row.data()[0];
  obj.type_id   = row.data()[1];
  obj.name      = row.data()[2];
  obj.sku       = row.data()[3];
  obj.price     = row.data()[4];
  arr.push(obj);
  //lấy tên và id product đã đc chọn
  arrnameproduct.push(obj.name);
  arrIdProduct.push(obj.entity_id);
  console.log(arrIdProduct);
  text = arrnameproduct.toString();
  
  jQuery("#name-product").html(text);
  
  var i;
  var table = "<tr><th>ENTITY_ID</th><th>TYPE_ID</th><th>NAME</th><th>SKU</th><th>PRICE</th><th>Action</th></tr>";
  for (i = 0; i < arr.length; i++) {
    table += "<tr><td>" +
             arr[i]["entity_id"] +
             "</td><td>" +
             arr[i]["type_id"] +
             "</td><td>" +
             arr[i]["name"] +
             "</td><td>" +
             arr[i]["sku"] +
             "</td><td>" +
             arr[i]["price"] +
             "</td><td>" +
             "<input type='button' value='REMOVE' class='remove' style='background-color: #d4d4aa'>"
    "</td></tr>"
    
  }
  
  table +=
    '<tr><td style="text-align: center"  colspan="6"><input type="button" style="background-color: #d4d4aa" name="checkout" value="CHECK OUT"></td></tr> ';
  jQuery("#choosed_products").html(table);
  jQuery("#choosedproducts").html('CHOOSED PRODUCTS')
  $('#choosed_products').on('click', '.remove', function () {
    
    $(this).closest('tr').remove();
    return false;
  })
  
})

function myFunctionPayment() {
  var x = document.getElementById("div_payment");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
  else {
    x.style.display = "none";
  }
}

$.getJSON('http://mage1.dev/index.php/helloworld/index/payment', function (data) {
  console.log(data);
  var checkbox = document.createElement('input');
  var i;
  var table    = "<tr><th>LABEL</th><th>VALUE</th></tr>";
  for (i = 0; i < data.length; i++) {
    table += "<tr><td>" +
             data[i]["label"] +
             "</td><td>" +
             data[i]["value"] +
             "</td></tr>"
  }
  console.log(table);
  jQuery("#payment").html(table);
});

function myFunctionShipping() {
  var x = document.getElementById("myDiv_shipping");
  if (x.style.display === "none") {
    x.style.display = "block";
  }
  else {
    x.style.display = "none";
  }
}

$.getJSON('http://mage1.dev/index.php/helloworld/index/shipping', function (data) {
  console.log(data);
  var checkbox = document.createElement('input');
  var i;
  var table    = "<tr><th>LABEL</th><th>VALUE</th></tr>";
  for (i = 0; i < data.length; i++) {
    table += "<tr><td>" +
             data[i]["label"] +
             "</td><td>" +
             data[i]["value"] +
             "</td></tr>"
  }
  console.log(table);
  jQuery("#shipping").html(table);
});

