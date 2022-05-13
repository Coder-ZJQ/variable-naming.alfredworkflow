export interface Formatter {
    name: string;
    format: (word: string) => string;
}

export class LowerCamelCase implements Formatter {
    name: string = "小驼峰"
    
    format(word: string): string {
        return word.split(" ").map((string, index) => {
            if (index > 0) {
                return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase()
            } else {
                return string.toLowerCase()
            }
        }).join("")
    }
}
export class UpperCamelCase implements Formatter {
    name: string = "大驼峰"
    
    format(word: string): string {
        return word.split(" ").map((string, index) => {
            return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase()
        }).join("")
    }
}
export class LowerUnderline implements Formatter {
    name: string = "小写下划线"
    
    format(word: string): string {
        return word.split(" ").map((string, index) => {
            return string.toLowerCase()
        }).join("_")
    }
}
export class UpperUnderline implements Formatter {
    name: string = "大写下划线"
    
    format(word: string): string {
        return word.split(" ").map((string, index) => {
            return string.toUpperCase()
        }).join("_")
    }
}