
/**
 * Login method of Authentication, adds user to lbp db format
 * @param username Username
 * @param password Password
 * @return Must include all data from getLoginData Database call
 */
export function auth(username: string, password: string): Promise<{username: string, fullName: string, class: string, type: string}> {
    return new Promise(function (resolve, reject) {
        if (username !== undefined && password !== undefined && password.length > 0 && username.length > 0) {
            let ldap = require("ldapjs");
            let client = ldap.createClient({
                url: 'ldap://tgm.ac.at'
            });
            client.bind(username.toLowerCase() + "@tgm.ac.at", password, function (err) {
                console.log("here it comes")
                console.log(err)
                if (!err) {
                    client.search("OU=People,OU=tgm,DC=tgm,DC=ac,DC=at", {
                        attributes: ["department", "cn", "employeetype"],
                        filter: "(sAMAccountName=" + username.toLowerCase() + ")",
                        scope: "sub"
                    }, function (err, data) {
                        if (!err) {
                            let ldapData;
                            data.on('searchEntry', function (entry) {
                                ldapData = {
                                    username: username.toLowerCase(),
                                    fullName: entry.object.cn,
                                    class: entry.object.department === "schueler" ? "student" : "lehrer",
                                    type: entry.object.employeeType
                                };
                            });
                            data.on('end', function () {
                                resolve(ldapData);
                                client.destroy();
                            });
                        } else {
                            client.destroy();
                            return reject(new Error("Crash 1"));
                        }
                    });
                } else {
                    client.destroy();
                    return reject(new Error("Crash 2"));
                }
            });
            client.on("error", function () {
                client.destroy();
                return reject(new Error("Crash 3"));
            });
        } else {
            return reject(new Error("Crash 4"));
        }
    });
}

export default auth

