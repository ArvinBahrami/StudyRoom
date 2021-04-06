var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var userSchema = new mongoose.Schema({
    First_Name:{type:String, required:true},
    Last_Name:{type:String, required:true},
    A_id:{type:String, required:true, unique: true},
    email:{type:String, required:true, unique: true},
    password:{type:String, required:true}
});

userSchema.pre("save", function(done){
    var user = this;

    if(!user.isModified("password")){
        return done();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err,salt){
        if(err){return done(err);}
        bcrypt.hash(user.password, salt, function(err, hashedPassword){
            if(err) {return done(err);}
            user.password = hashedPassword;
            done();
        });
    });

});

userSchema.methods.checkPassword = function(guess, done){
      if(this.password != null){
          bcrypt.compare(guess,this.password, function(err, isMatch){
             done(err, isMatch);
          });
      }
}

var User = mongoose.model("User", userSchema);

module.exports = User;