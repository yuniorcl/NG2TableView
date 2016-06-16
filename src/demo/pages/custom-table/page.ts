import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {CanActivate, OnActivate, ComponentInstruction} from "@angular/router-deprecated";
import {PageTableColumns} from "./cols/columns";
import {Utils} from "../../utils/app-utils";
import {NG_TABLE_VIEW_DIRECTIVES, TableView} from "NG2TableView";

let html = require('!!prismjs?lang=markup!./prism/template.html');
let ts = require('!!prismjs?lang=typescript!./prism/table.ts');
let cols = require("!!prismjs?lang=typescript!./cols/columns");
let template = require('./page.html');

@Component({
    selector: "demo-page",
    directives: [NG_TABLE_VIEW_DIRECTIVES],
    providers: [],
    pipes: [],
    template: Utils.format(template, html, ts, cols)
})
@CanActivate((next) => {
    return Utils.getService(Http).get('demo/data/data.json')
        .map(res => res.json())
        .toPromise()
        .then((data)=> next.routeData.data['users'] = data)
})
export class CustomTable extends TableView implements OnActivate {

    private users:Array<any>;

    constructor() {
        super([]);
    }

    routerOnActivate(next:ComponentInstruction, prev:ComponentInstruction):any|Promise<any> {
        this.users = next.routeData.data['users'];
        return Promise.resolve(true);
    }

    ngOnInit() {
        this.getBuilder()
            .setData(this.users)
            .addCols(PageTableColumns)
            .setPaging(true)
            .setItemsPerPage(5)
            .setSelectable(true);

        this.buildTable();

    }
}