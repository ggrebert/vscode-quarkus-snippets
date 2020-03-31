import * as fs from 'fs';
import * as rm from 'typed-rest-client/RestClient';
import * as traverse from 'traverse';
import * as vscode from 'vscode';
import * as xml2js from 'xml2js';
import * as ncp from 'ncp';

interface GithubRelease {
    url: string;
    tag_name: string;
    name: string;
    html_url: string;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.checkQuarkusUpdate', () => {

        if (!vscode.workspace.workspaceFolders) {
            console.error('Not in a workspace');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;

        let rest: rm.RestClient = new rm.RestClient('quarkus-snippets', 'https://api.github.com');
        rest.get<GithubRelease>('/repos/quarkusio/quarkus/releases/latest').then(response => {
            if (!response.result) {
                return;
            }

            const latestRelease = response.result;

            fs.readFile(workspaceFolder + '/pom.xml', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }

                xml2js.parseStringPromise(data.toString(), {
                    trim: true,
                    normalizeTags: true,
                    normalize: true,
                    mergeAttrs: true,
                }).then(result => {
                    // Removes all the arrays with single elements with a string value.
                    traverse(result).forEach(function (this: any, element: any) {
                        if (element instanceof Array && element.length === 1) {
                            this.update(element[0]);
                        }
                    });

                    let version;
                    if (result.project.dependencymanagement.dependencies instanceof Array) {
                        result.project.dependencymanagement.dependencies.forEach((element: any) => {
                            if (element.groupid === "io.quarkus" && element.artifactid === "quarkus-bom") {
                                version = element.version;
                            }
                        });
                    }
                    else {
                        version = result.project.dependencymanagement.dependencies.dependency.version;
                    }

                    if (version.match(/^\$/)) {
                        version = version.replace(/^\$\{([^\}]+)\}$/, '$1');
                        version = result.project.properties[version];
                    }

                    if (version === latestRelease.name) {
                        vscode.window.showInformationMessage("Quarkus up-to-date.");
                    }
                    else {
                        vscode.window.showErrorMessage(`Version ${latestRelease.name} available.`, 'Show details')
                            .then(selection => {
                                vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(latestRelease.html_url));
                            });
                    }
                });
            });
        });
    });

    let devcontainer = vscode.commands.registerCommand('extension.initDevContainer', () => {
        if (!vscode.workspace.workspaceFolders) {
            console.error('Not in a workspace');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path;

        if (fs.existsSync(workspaceFolder + '/.devcontainer')) {
            vscode.window.showErrorMessage('Folder already contains a dev container configuration file.');
            return;
        }

        ncp(context.extensionPath + '/src/assets/devcontainer', workspaceFolder + '/.devcontainer', function (err) {
            if (err) {
                return console.error(err);
            }
        });
    });

    context.subscriptions.push(disposable, devcontainer);
}

// this method is called when your extension is deactivated
export function deactivate() { }
