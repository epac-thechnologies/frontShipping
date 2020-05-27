import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "field"
})
export class FieldPipe implements PipeTransform {

  constructor() {}
  transform(value: any, ...args: any[]): any {
    const column: any = args[0];
    let result = value;
    column.field.split(".").forEach(f => (result = result[f]));
    return result;
  }
}
