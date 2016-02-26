angular.module("directive.g+signin").factory("chatAPI" ,function($http,$cookieStore,$rootScope){
	
	var _login = function(authResult){
		if(authResult != null){
			var perfil = authResult.getBasicProfile();
			$rootScope.globals = {
			         user: {
			        	 token: authResult.getAuthResponse().id_token,
			        	 name: perfil.getName(),
			        	 email: perfil.getEmail(),
			        	 photo: perfil.getImageUrl(),
			        	 userID: perfil.getId()	 
			         }
				};
			$cookieStore.put('globals', $rootScope.globals);
		}
	};
	
	var _logout = function (){
		$cookieStore.put('globals', '');
	}
	var _getUserName = function(){
		return ($cookieStore.get('globals') === '' || $cookieStore.get('globals') === undefined) ? "" : $cookieStore.get('globals').user.name;
	};
	var _getUserPhoto = function(){
		return ($cookieStore.get('globals') === '' || $cookieStore.get('globals') === undefined) ? "" : $cookieStore.get('globals').user.photo;
	};
	
	var _hasUser = function(){
		return $cookieStore.get('globals') != "" && $cookieStore.get('globals') != undefined;
	}
	var _getUserEmail = function(){
		return ($cookieStore.get('globals') === '' || $cookieStore.get('globals') === undefined) ? "" : $cookieStore.get('globals').user.email;
	}
	

	
	return {
		login 			: _login,
		logout          : _logout,
		getUserName 	: _getUserName,
		getUserPhoto 	: _getUserPhoto,
		hasUser 		: _hasUser,
		getUserEmail    : _getUserEmail
		
	};
	
	
});


