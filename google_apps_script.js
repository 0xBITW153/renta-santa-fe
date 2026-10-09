// =========================================================================
// GOOGLE APPS SCRIPT PARA RENTA SANTA FE WEBAPP
// Copia y pega este código en: Extensiones > Apps Script en tu Google Sheets
// =========================================================================

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetTx = getOrCreateSheet(ss, "Transacciones", [
      "ID", "Fecha", "Periodo", "Concepto", "Tipo", "Monto"
    ]);
    var sheetMaint = getOrCreateSheet(ss, "Mantenimiento", [
      "ID", "Nombre", "Etiqueta", "Costo"
    ]);

    var txData = sheetTx.getDataRange().getValues();
    var maintData = sheetMaint.getDataRange().getValues();

    var transactions = [];
    for (var i = 1; i < txData.length; i++) {
      if (!txData[i][0]) continue;
      transactions.push({
        id: String(txData[i][0]),
        date: String(txData[i][1]),
        period: String(txData[i][2]),
        concept: String(txData[i][3]),
        type: String(txData[i][4]),
        amount: Number(txData[i][5])
      });
    }

    var maintenanceItems = [];
    for (var j = 1; j < maintData.length; j++) {
      if (!maintData[j][0]) continue;
      maintenanceItems.push({
        id: String(maintData[j][0]),
        name: String(maintData[j][1]),
        tag: String(maintData[j][2]),
        cost: Number(maintData[j][3])
      });
    }

    var response = {
      status: "success",
      transactions: transactions,
      maintenanceItems: maintenanceItems
    };

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetTx = getOrCreateSheet(ss, "Transacciones", ["ID", "Fecha", "Periodo", "Concepto", "Tipo", "Monto"]);
    var sheetMaint = getOrCreateSheet(ss, "Mantenimiento", ["ID", "Nombre", "Etiqueta", "Costo"]);

    if (action === "syncAll") {
      // Reemplaza todo el contenido con la lista sincronizada
      sheetTx.clearContents();
      sheetTx.appendRow(["ID", "Fecha", "Periodo", "Concepto", "Tipo", "Monto"]);
      if (data.transactions && data.transactions.length > 0) {
        var txRows = data.transactions.map(function(t) {
          return [t.id, t.date, t.period, t.concept, t.type, t.amount];
        });
        sheetTx.getRange(2, 1, txRows.length, 6).setValues(txRows);
      }

      sheetMaint.clearContents();
      sheetMaint.appendRow(["ID", "Nombre", "Etiqueta", "Costo"]);
      if (data.maintenanceItems && data.maintenanceItems.length > 0) {
        var maintRows = data.maintenanceItems.map(function(m) {
          return [m.id, m.name, m.tag, m.cost];
        });
        sheetMaint.getRange(2, 1, maintRows.length, 4).setValues(maintRows);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Sincronizado completo" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "unknown_action" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0f172a").setFontColor("#38bdf8");
  }
  return sheet;
}
