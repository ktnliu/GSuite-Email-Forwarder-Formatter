function getSubgroups(fwdRange, dstRange) {
  var emailArray = [];
  var currentFwdEmail = '';
  
  if (fwdRange && dstRange) {
    currentFwdEmail = fwdRange[0][0];
        
    for (var i = 0; i < dstRange.length; i++) {
      fwdEmail = fwdRange[i][0];
      //update currentFwd only if it's diff/not empty
      if ( 
        (fwdEmail === '' || fwdEmail === currentFwdEmail ) &&
        i < dstRange.length - 1
       ){
        continue;
      } else {
        var subRange = dstRange.splice(0,i).filter(
          function (row) { // remove empty rows
            return row[0] !== ''
          }
        ); // range for a single forwarder 
        var fwdPrefix = currentFwdEmail.split('@', 1);
        emailArray.push(branchHelper(fwdPrefix, subRange));
        currentFwdEmail = fwdEmail;
        fwdRange.splice(0,i);
        i = 0;        
      }
    }
  }

  return emailArray
}


function BRANCHEMAILS2(fwdRange, dstRange) {
  var emailArray = getSubgroups(fwdRange, dstRange);
  var fwdEmail;

  // iterate through subgroups and concatenate them
  let emails = '';
  for (var i = 0; i < emailArray.length; i++) {
    for (var j = 0; j < emailArray[i].length; j++){
      emails += emailArray[i][j] + '\n';    
    }
  }
  return emails;
}



function branchHelper(fwdPrefix, dstArray, level = 1) {
  var emailArray = [];
  var fwdArray = [];
  var dstArray = dstArray;
  var j = 0; // tracks grouping
  var k = 1;
  
  var dstEmail = '';
  var fwdEmail = fwdPrefix + 
    // Put level designation (if greater than level 1).
    // Also disregard if this is the "furthest" the level can go.
    ( (level > 1 && dstArray.length > 12) ? `-level${level}` : `` ) + 
    ( dstArray.length > 12 ? `-${k}` : '') + 
      '@example.org';
  var uniqueFwdEmailsArray = [];
  
  for (var i = 0; i < dstArray.length; i++) {
    if (dstEmail === dstArray[i][0]) continue;
   
    if (j >= 12) {
      uniqueFwdEmailsArray.push([fwdEmail]);
      k++;
      fwdEmail = fwdPrefix + 
        ( level > 1 ? `-level${level}` : `` ) + 
        ( dstArray.length > 12 ? `-${k}` : '') +  `@example.org`;
      j = 0;
    }
    
    dstEmail = dstArray[i][0];
    j++;
    fwdArray[i] = [fwdEmail];
    emailArray.push(fwdEmail + ', ' + dstEmail);
  }
  // do the following one more time for the tail subgroup
  uniqueFwdEmailsArray.push([fwdEmail]);

  if (dstArray.length <= 12) {
    return emailArray;
  }
  return emailArray.concat(branchHelper(fwdPrefix, uniqueFwdEmailsArray, level + 1));
}