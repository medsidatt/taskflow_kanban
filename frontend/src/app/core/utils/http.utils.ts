import { HttpParams } from '@angular/common/http';

/**
 * HTTP Utility functions
 */
export class HttpUtils {
  /**
   * Build HTTP params from an object
   * Removes null and undefined values
   */
  static buildParams(params: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(key, item.toString());
          });
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });
    
    return httpParams;
  }

  /**
   * Build URL with path parameters
   */
  static buildUrl(template: string, params: { [key: string]: string | number }): string {
    let url = template;
    Object.keys(params).forEach(key => {
      url = url.replace(`{${key}}`, params[key].toString());
    });
    return url;
  }

  /**
   * Build query string from object
   */
  static buildQueryString(params: { [key: string]: any }): string {
    return this.buildParams(params).toString();
  }
}
