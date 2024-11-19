class Location {
    constructor(LocationID, StreetAddress, Suburb, City, Province, PostalCode, Country, latitude, longitude) {
      this._LocationID = LocationID;          
      this._StreetAddress = StreetAddress;      
      this._Suburb = Suburb;      
      this._City = City;        
      this._Province = Province;    
      this._PostalCode = PostalCode;        
      this._Country = Country; 
      this._Latitude = latitude; 
      this._Longitude = longitude;          
    }
  
    //_____________________SETTERS_____________________________________
  
    set LocationID(value) {
      throw new Error('AlertID cannot be modified');
    }
  
    set StreetAddress(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('Street Address must be a non-empty string');
      }
      this._StreetAddress = value;
    }
  
    set Suburb(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('Suburb must be a non-empty string');
      }
      this._Suburb = value;
    }
  
    set City(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('City must be a non-empty string');
      }
      this._City = value;
    }
  
    set Province(value) {
      if (typeof value !== 'number' || value <= 0) {
        throw new Error('Province must be a positive number');
      }
      this._Province = value;
    }
  
    set PostalCode(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('PostalCode must be a non-empty string');
      }
      this._PostalCode = value;
    }
  
    set Country(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('Country must be a non-empty string');
      }
      this._Country = value || null; // Null if no message
    }
    set latitude(value) {
        if (typeof value !== 'string' || value.trim() === '') {
          throw new Error('latitude must be a non-empty string');
        }
        this._Latitude = value || null; // Null if no message
      }
      set Longitude(value) {
        if (typeof value !== 'string' || value.trim() === '') {
          throw new Error('Longitude must be a non-empty string');
        }
        this._Longitude = value || null; // Null if no message
      }
  
    //_____________________GETTERS_____________________________________
  
    get LocationID() {
      return this._LocationID;
    }
  
    get StreetAddress() {
      return this._StreetAddress;
    }
  
    get Suburb() {
      return this._Suburb;
    }
  
    get City() {
      return this._City;
    }
  
    get Province() {
      return this._Province;
    }
  
    get PostalCode() {
      return this._PostalCode;
    }
  
    get Country() {
      return this._Country;
    }
    get Latitude() {
        return this._Latitude;
    }
    get Longitude() {
        return this._Longitude;
    }
  }
  
  module.exports = Location;
  