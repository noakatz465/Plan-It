
export class TemplateModel {
    _id?: string;
    name: string;
    description: string;

    constructor(
        name: string,
        description: string,
        _id?: string
    ) {
        this.name = name;
        this._id = _id;
        this.description = description;
    }
}  