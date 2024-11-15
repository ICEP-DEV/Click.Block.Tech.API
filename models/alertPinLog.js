class AlertPinLog {
    constructor(CustID_Nr, TriggerDate, Action) {
      this._CustID_Nr = CustID_Nr;
      this._TriggerDate = TriggerDate || new Date(); // Default to current timestamp if not provided
      this._Action = Action;
    }
  
    set CustID_Nr(value) {
      if (typeof value !== 'string' || value.length !== 13) {
        throw new Error('CustID_Nr must be a 13-character string');
      }
      this._CustID_Nr = value;
    }
  
    set TriggerDate(value) {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        throw new Error('TriggerDate must be a valid date');
      }
      this._TriggerDate = value;
    }
  
    set Action(value) {
      if (typeof value !== 'string' || value.trim() === '') {
        throw new Error('Action must be a non-empty string');
      }
      this._Action = value;
    }
  
    get CustID_Nr() {
      return this._CustID_Nr;
    }
  
    get TriggerDate() {
      return this._TriggerDate;
    }
  
    get Action() {
      return this._Action;
    }
  }
  
  module.exports = AlertPinLog;
  