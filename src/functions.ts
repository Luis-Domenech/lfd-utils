import path from "path"
import fs from "fs"
import { IndentOverload } from "./types.js"

/**
 * A function that takes words in snace case and returns them in camel case.
 * @param snake_case A string of something in snake case format
 * @returns A string in camel case format
 */
export const camel_case_to_snake_case = (snake_case: string) => {
  let str = ""

  for (const word of snake_case.replace(/[\r\n]/gm, "\n").replace(/[\n]/gm, " ").split(" ")) {
    str += str ? " " : "" // Add space for enxt word
    let w = ""
    let in_word = false
    let prev = ""
    for (const c of word) {
      if (c.toLowerCase() === c) {
        // Here we are at a lower case word
        w += c
        prev = c
        if (in_word) in_word = false
      }
      else {
        // Here means we have a capital letter
        // We check if in_word is true, cause if it is, then
        // current capital letter will not be part of a new _word 
        if (in_word) {
          w += c.toLowerCase()
          prev = c.toLowerCase()
        }
        else {
          w += prev === '_' ? c.toLowerCase() : `_${c.toLowerCase()}` 
          in_word = true
        }
      }
    }

    str += w.charAt(0) === "_" ? w.slice(1) : w
  }
  return str
}

/**
 * A function that takes a string and return whether or not the string contains any string contained in the array provided.
 * @param target String to check
 * @param pattern Arry of strings to check for
 * @param case_sensitive If true, comparisons will be case_sensitive
 * @returns If target includes any pattern in the pattern array
 */
export const contains = (target: string, pattern: string[], case_sensitive = true): boolean => {
  let found = false

  pattern.map(async (word) => {
    if (case_sensitive ? target.includes(word) : target.toLocaleLowerCase().includes(word.toLocaleLowerCase())) found = true
  })

  return found
}

/**
 * A function that check if a target object is contained in an array of objects or if an object equals an object's keys or values (recursively).
 * @param target Object to check
 * @param to_check Array or object to check for
 * @param check_keys If true, when given an object to check, target object will also be compared against the object's keys in addition to its values
 * @returns If target equals an element in the array or equals a key or value within an object
 */
export const is_in = (target: any, to_check: any[] | Record<string, any>, check_keys = true): boolean => {
  if (Array.isArray(to_check)) {
    for (const element of to_check) {
      if (Array.isArray(element)) {
        if (is_in(target, element)) return true
      }
      else if (typeof element === "object") {
        if (is_in(target, element)) return true
      }
      else {
        if (target === element) return true
      }
    }
  }
  else {
    for (const [key, value] of Object.entries(to_check)) {
      // Only check keys if their the same type
      if (check_keys && typeof key === typeof target) {
        if (target === key) return true
      }

      if (Array.isArray(value)) {
        if (is_in(target, value)) return true
      }
      else if (typeof value === "object") {
        if (is_in(target, value)) return true
      }
      else {
        if (target === value) return true
      }
    }
  }
  return false
}


/**
 * A function that checks if target string ends with a string in the array
 * @param target String to check
 * @param endings Array of endings to check for
 * @param case_sensitive If true, comparisons will be case_sensitive
 * @returns If targer ends with any string in the endings array
 */
export const ends_with_any = (target: string, endings: string[], case_sensitive = true): boolean => {
  for (const word of endings) {
    if (case_sensitive ? target.endsWith(word) : target.toLocaleLowerCase().endsWith(word.toLowerCase())) return true
  }
  return false
}

/**
 * A function that checks if target string starts with a string in the array
 * @param target String to check
 * @param starts Array of starts to check for
 * @param case_sensitive If true, comparisons will be case_sensitive
 * @returns If targer ends with any string in the endings array
 */
 export const starts_with_any = (target: string, starts: string[], case_sensitive = true): boolean => {
  for (const word of starts) {
    if (case_sensitive ? target.startsWith(word) : target.toLocaleLowerCase().startsWith(word.toLowerCase())) return true
  }
  return false
}

/**
 * A function that flattens an N dimensional array to a one dimensional array
 * @param arr Array to flatten
 * @returns An n-dimensional array flattened to a one dimensional array
 */
export const flatten = <T>(arr: any): T[] => {
  return arr.reduce(function (flat: any, toFlatten: any) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

/**
 * A function that takes a string and converts it to package name format. For example: Simple GraphQL Parser -> simple-graphql-parser
 * @param name String to convert
 * @returns A string in package name format
 */
export const name_to_pkg_name = (name: string) => name.replace(/[\s]+/gm, "-").toLowerCase()

/**
 * A function that takes a string and finds the first match using the regex provided and returns that as is or with patterns removed if remove_match was passed
 * @param target String to get a match from
 * @param match Regex pattern to match for
 * @param remove_match String or Regex pattern to match and remove from to_modify after match
 * @returns A string of the first match with all patterns from remove_match removed from that match or an empty string if no matches were found
 */
export const match_and_remove = (target: string, match: RegExp, remove_match: RegExp | string = ""): string => {
  const matches = target.match(match)

  if (matches) {
    if (matches[0]) return matches[0].replace(remove_match, "")
    else return ''
  }
  else return ''
}

/**
 * A function that takes a string and returns the first match it finds from a given Regex expression
 * @param target A string to get a match from
 * @param match Regex pattern to match for
 * @returns The first match from the given regex or an empty string if no matches were found
 */
export const match_first = (target: string, match: RegExp): string => {
  if (!target) return ''
  
  const matches = target.match(match)

  if (matches) {
    if (matches[0]) return matches[0]
    else return ''
  }
  else return ''
}

/**
 * A function that takes an input directory path and removes the folder or just it's files within
 * @param dir_path Path of directory to remove
 * @param only_content Determine if to remove only the files within directory only
 */
export const remove_dir = async (dir_path: string, only_content: boolean) => {
  try {
    const exists = fs.statSync(dir_path)

    if (exists) {
      const dir_entries = fs.readdirSync(dir_path, { withFileTypes: true })

      if (dir_entries) {
        await Promise.all(
          dir_entries.map(async dir_entry => {
            const full_path = path.join(dir_path, dir_entry.name)
            
            return dir_entry.isDirectory()
              ? await remove_dir(full_path, false)
              : fs.unlinkSync(full_path)
          }),
        )
        
      }

      if (!only_content) fs.rmdirSync(dir_path)
    } 
  }
  catch (e) {
    // Do nothing
  }
}

/**
 * A function that returns a to_indent prefixed by a string of indents, where each indent is X whitespace characters, X being equal to indent_spaces. This function can be called with string, to_indent, as first or last parameter. Do note that all parameters are optional, regardless of order, and in case that no paramters are passed, function will just execute with default values.
 * @param to_indent String to indent
 * @param indent_amount Amount of indents to return. Numbers are taken as there absolute counterparts so negative number will be turned positive. If passed a value of 0, the function returns an empty string, which is expected behaviour. Default value is `1`.
 * @param indent_spaces Amount of spaces in an indent. Default value is `2`.
 * @returns A string prefixed with a number of indents equal to indents. Default value is `""`
 */
export const indent: IndentOverload = (a?: string | number, b?: number, c?: string | number): string => {
  let to_indent = ""
  let indent_amount = 1
  let indent_spaces = 2

  // These checks are to determine order of provided parameters
  if (typeof a === "string") {
    if (a) to_indent = a
    if (b && typeof b === "number") indent_amount = b
    if (c && typeof c === "number") indent_spaces = c
  }
  else if (typeof a === "number") {
    if (a) indent_amount = a
    if (b && typeof b === "number") indent_spaces = b
    if (c && typeof c === "string") to_indent = c
  }
  
  const indent_prefix = " ".repeat(indent_spaces + (indent_amount - 1) * indent_spaces)
  return `${indent_prefix}${to_indent}`
}

/**
 * A function that does the same as JSON.stringify(), but removes all quotes on all keys in the object and can output the string to one line if so desired
 * @param obj Object to stringify
 * @param indent_spaces How much spaces should indents be. Basically, this would be the third parameter in JSON.stringify() and must be greater than zero since those spaces are needed for the regex to work correctly. Any value less than 2 will be set to two.
 * @param indent_offset If to_one_line is false, then string returned will be formatted exactly as if running JSON.parse(obj, null, indent_spaces). However, if you need all lines after the initial '{' to be spaced x spaces from start of line, then this setting does that. Do note that, for example, if indent_spaces is 2 and indent_offset is 3, then the space offset added to every line will be 2 * 3 = 6 spaces from start of line.
 * @param to_one_line If true, string return will be a one liner
 * @param offset_first_line If indent_offset is set and to_one_line is false and this is true, then the first line, '{' will be indented too
 * @returns Return a a stringified version of an object with quptes removed on fields only
 */
export const stringify = (obj: any, indent_spaces = 2, indent_offset = 0, to_one_line = false, offset_first_line = true): string => {
  if (!obj || typeof obj !== "object") return ""
  let cleaned = JSON.stringify(obj, null, indent_spaces < 2 ? 2 : indent_spaces)
  cleaned = cleaned.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, function (match) { return match.replace(/"/g, "") })

  if (to_one_line) {
    let one_lined = cleaned.replace(/[\r\n]/gm, "")
    one_lined = cleaned.replace(/[\s]+/gm, " ".repeat(indent_spaces < 2 ? 2 : indent_spaces))
    return one_lined
  }

  if (indent_offset > 0) {
    if (cleaned === "{}") return cleaned
    let indented = ""
    const lines = cleaned.replace(/[\r\n]/gm, "\n").split("\n")
    const line_nums = lines.length

    if (line_nums === 1) {
      indented += (offset_first_line ? indent(lines[0], indent_offset, indent_spaces) : "")
    }
    else {
      for (const [pos, value] of lines.entries()) {
        if (pos === 0) indented += (offset_first_line ? indent(value + "\n", indent_offset, indent_spaces) : value + "\n")
        else if (pos !== line_nums - 1) indented += indent(value + "\n", indent_offset, indent_spaces)
        else indented += indent(value, indent_offset, indent_spaces) // So string ends right at '}'
      }
    }

    return indented
  }

  return cleaned
}

/**
 * A simple function that sort of operates like time.sleep() in python. Can be used in async function to wait X number of milliseconds before continuing execution.
 * @param d Time to delay by (in milliseconds)
 * @returns A promise of when delay is finished
 */
export const delay = (d: number) => new Promise(resolve => setTimeout(resolve, d))


/**
 * A function to construct a date at the current time and add or subtract time absed on params passed.
 * @param days Amount of days to add or subtract from current date.
 * @param months Amount of months to add or subtract from current date.
 * @param years Amount of years to add or subtract from current date.
 * @param hours Amount of hours to add or subtract from current date.
 * @param minutes Amount of minutes to add or subtract from current date.
 * @param seconds Amount of seconds to add or subtract from current date.
 * @returns A date set X time from now dependent on parameters passed.
 */
export const create_date = (days = 0, months = 0, years = 0, hours = 0, minutes = 0, seconds = 0): Date => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setMonth(date.getMonth() + months)
  date.setFullYear(date.getFullYear() + years)

  const h = hours * 60 * 60 * 1000
  const m = minutes * 60 * 1000
  const s = seconds * 1000
  const ms = h + m + s

  date.setTime(date.getTime() + ms)

  return date
}

/**
 * A function to add or subtract time to a given date based on params passed.
 * @param date Date to add or subtract time to.
 * @param days Amount of days to add or subtract to given date.
 * @param months Amount of months to add or subtract to given date.
 * @param years Amount of years to add or subtract to given date.
 * @param hours Amount of hours to add or subtract to given date.
 * @param minutes Amount of minutes to add or subtract to given date.
 * @param seconds Amount of seconds to add or subtract to given date.
 * @returns A date set X time from the date given dependent on parameters passed.
 */
export const add_to_date = (date: Date, days: number, months: number, years: number, hours = 0, minutes = 0, seconds = 0): Date => {
  date.setDate(date.getDate() + days)
  date.setMonth(date.getMonth() + months)
  date.setFullYear(date.getFullYear() + years)

  const h = hours * 60 * 60 * 1000
  const m = minutes * 60 * 1000
  const s = seconds * 1000
  const ms = h + m + s

  date.setTime(date.getTime() + ms)

  return date
}

/**
 * Simple function to take a Date or use the current Date and covnert that date into a sepcified string format.
 * @param date Date to format.
 * @param format How to format the date.
 * @returns A formatted string of the given date
 */
export const formatted_date = (date: Date = new Date(), format: 'mm-dd-yyyy' | 'yyyy-mm-dd' = 'yyyy-mm-dd'): string => {
  let d = date
  if (typeof date === 'string') {
    d = new Date(date)
  }

  const padTo2Digits = (num: number)  => {
    return num.toString().padStart(2, '0')
  }
  
  const ret = format === 'yyyy-mm-dd' ? [
    d.getFullYear(),
    padTo2Digits(d.getMonth() + 1),
    padTo2Digits(d.getDate()),
  ].join('-') :
    format === 'mm-dd-yyyy' ? [
      padTo2Digits(d.getMonth() + 1),
      padTo2Digits(d.getDate()),
      d.getFullYear(),
    ].join('-') : [
      d.getFullYear(),
      padTo2Digits(d.getMonth() + 1),
      padTo2Digits(d.getDate()),
    ].join('-')

  return ret
}

/**
 * Simple function to convert an ICS date like `20210922T164500Z` to a Date.
 * Prisma's DateTime primitive type stores timestamps in DB in ICS format, so this funciton helps convert ICS timestamps to Date. 
 * @param ics_date ICS formatted date to parse.
 * @returns A Date object contructed fromt the given ICS string.
 */
export const parse_ics_date = (ics_date: string): Date | string => {
  if (!/^[0-9]{8}T[0-9]{6}Z$/.test(ics_date))
    return 'ICS Date is wrongly formatted: ' + ics_date
  
  try {
    const year = parseInt(ics_date.substring(0, 4))
    const month = parseInt(ics_date.substring(4, 6))
    const day = parseInt(ics_date.substring(6, 8))
    
    const hour   = parseInt(ics_date.substring(9, 11))
    const minute = parseInt(ics_date.substring(11, 3))
    const second = parseInt(ics_date.substring(13, 15))  
 
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  }
  catch(e) {
    return 'ICS Date is wrongly formatted: ' + ics_date
  }
}



