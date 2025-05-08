const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


var userSignUp = document.getElementById("userSignUp");
	userSignUp.addEventListener('click',()=>{
		let signUPname = document.getElementById("signUPname").value; // Get value of the input
		let signUPemail = document.getElementById("signUPemail").value; // Get value of the input
		let signUPpassword = document.getElementById("signUPpassword").value;
		fetch("/signUP",{
			method:"POST",
			headers: {
            	'Content-Type': 'application/json'
        	},
			body: JSON.stringify({signUPname,signUPemail,signUPpassword})
		}).then((data)=>{
			return data.json()
		}).then((data)=>{
			console.log(data)
			if(data.succsess){
				alert(data.message);
			}else{
				alert("Err: "+data.message);
			}
			window.location.href = "login.html"
		})
	})

	var userSignUp = document.getElementById("userSignIn");
	userSignUp.addEventListener('click',()=>{
		let signUPname = document.getElementById("signUPname").value;
		let signInemail = document.getElementById("signInemail").value; 
		let signInpassword = document.getElementById("signInpassword").value;
		fetch("/signIn",{
			method:"POST",
			headers: {
            	'Content-Type': 'application/json'
        	},
			body: JSON.stringify({signInemail,signInpassword})
		}).then((data)=>{
			console.log(data);
			window.location.href = "index.html"
		})
	})
