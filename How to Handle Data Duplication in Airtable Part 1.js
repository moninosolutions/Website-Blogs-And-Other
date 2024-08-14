// |-------------------------------------------------|
// | Monino Solutions                                |
// |-------------------------------------------------|
// | Our Website: https://moninosolutions.com        |
// | Read & Learn: https://moninosolutions.com/blogs |
// | Contact Us: https://moninosolutions.com/Contact |
// |-------------------------------------------------|


//---------------------
//GET TABLE AND RECORDS
//---------------------
let table = base.getTable("Table_Name");

let table_data = await table.selectRecordsAsync(
    {
        sorts: [{ field: "createdTime" }]
    }
);

//---------
//MAIN CODE
//---------
let duplicated_values = {};
let existing_ids = [];
for (let record_1 of table_data.records) {
    let is_there = false;
    for (let existing_id of existing_ids) {
        if (existing_id == record_1.id) {
            is_there = true;

        }

    }

    if (!is_there) {
        let temp_records = [];
        for (let record_2 of table_data.records) {
            if (record_1.getCellValueAsString("Email") == record_2.getCellValueAsString("Email") && record_1.id != record_2.id) {
                if (temp_records.length == 0) {
                    temp_records.push(record_1)
                    temp_records.push(record_2)
                    existing_ids.push(record_1.id);
                    existing_ids.push(record_2.id);

                } else {
                    temp_records.push(record_2)
                    existing_ids.push(record_2.id);

                }

            }

        }

        let first = temp_records[0];
        let last = temp_records[(temp_records.length - 1)];

        //-------------------
        //SEND RECORDS TO API
        //-------------------
        await table.updateRecordsAsync([
            {
                id: first.id,
                fields: {
                    "Notes": last.getCellValue("Notes"),
                },
            }
        ]);

        for (let delete_id of temp_records) {
            if (delete_id.id != first.id) {
                table.deleteRecordAsync(delete_id.id)
            }
        }
    }
}
