
export class TemplateModel {
    _id?: string
    description: string;

    constructor(
        description: string,
        _id?: string
    ) {
        this._id = _id;
        this.description = description;
    }
}  