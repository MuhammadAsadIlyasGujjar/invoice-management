import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  private loginUrl = '/auth/login';
  private logoutUrl = '/auth/logout';
  private refreshTokenUrl = '/auth/refresh-token';

  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  private accessToken: string | null = null;
  JWPHelper: JwtHelperService;

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
  
  getAccessToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.accessTokenKey);
    }
    return null;
  }

  getRefreshToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  constructor(private http: HttpClient, private router: Router) {
    this.JWPHelper = new JwtHelperService();
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(this.loginUrl, body);
  }

  logout(): Observable<any> {
    return this.http.post<any>(this.logoutUrl, null);
  }

  refreshToken(canRedirect: boolean = true): Observable<any> {
    return this.http.post<any>(this.refreshTokenUrl, {user:this.getRefreshToken()})
      .pipe(
        tap(response => {
          this.accessToken = response.accessToken.access_token;
        }),
        catchError(error => {
          if (canRedirect) {
            // Handle the error and redirect to /auth/sign-in
            this.router.navigate(['/auth/sign-in']);
          }

          return throwError(() => new Error(error));
        })
      );
  }

  isAuthenticated(): boolean {
    this.accessToken = this.getAccessToken()
    // Check if the access token exists and is not expired
    return !!this.accessToken && !this.isTokenExpired();
  }

  private isTokenExpired(): boolean {
    // Implement your token expiration logic here
    // You can check the token expiry date or any other criteria

    // Assuming you have a method to get the expiry date from the token
    const expiryDate = this.getExpiryDateFromToken();

    if (expiryDate) {
      // Compare the expiry date with the current date
      return new Date() > expiryDate;
    }

    return true; // Token expired if expiry date is not available
  }

  private getExpiryDateFromToken(): Date | null {
    // Implement your logic to extract the expiry date from the token
    // Parse the token and retrieve the expiry date

    // Example implementation assuming the token contains an 'exp' claim
    const token = this.accessToken;
    if (token) {
      const splittedToken = token.split('.')
      if (splittedToken?.length < 3) {
        return null;
      }

      const alotOutput = atob(splittedToken[1]);

      if(!isValidJSON(alotOutput)) {
        return null
      }
      const tokenPayload = JSON.parse(alotOutput);
      const expiryTime = tokenPayload.exp * 1000; // Convert expiry time from seconds to milliseconds
      return new Date(expiryTime);
    }

    return null; // Return null if expiry date is not available
  }

  // parseJwt(token: string | null) {
  //   if (token) {
  //     const splittedToken = token.split('.')
  //     if (splittedToken?.length < 3) {
  //       return null;
  //     }
  //     const base64Url = splittedToken[1];
  //     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //     const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
  //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //     }).join(''));

  //     if(!isValidJSON(jsonPayload)) {
  //       return null
  //     }
  
  //     return JSON.parse(jsonPayload);
  //   }
  //   return null;
  // }

  parseJwt(token: string | null): any {
    if (!token) {
      return null;
    }
  
    try {
      const splittedToken = token.split('.');
      if (splittedToken.length !== 3) {
        return null;
      }
  
      const base64Url = splittedToken[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
      // Adding padding if necessary
      const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  
      // Decoding base64 safely without using decodeURIComponent
      const jsonPayload = atob(paddedBase64);
      
      // Optionally check if the payload is valid JSON before parsing
      if (!isValidJSON(jsonPayload)) {
        return null;
      }
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT:', error);
      return null;
    }
  }

  // getPermissions(): string[] {
  //   const authToken = this.getAccessToken()
  //   if (authToken) {
  //     const decodedToken = this.JWPHelper.decodeToken(authToken);
  //     return decodedToken ? decodedToken.permissions : [];
  //   }
  //   return [];
  // }

  getPermissions(): string[] {
    const authToken = this.getAccessToken();
    if (authToken) {
      try {
        const decodedToken = this.safeDecodeToken(authToken);
        return decodedToken && Array.isArray(decodedToken.permissions) ? decodedToken.permissions : [];
      } catch (error) {
        // console.error('Failed to decode token or extract permissions:', error);
        return [];
      }
    }
    return [];
  }
  
  private safeDecodeToken(token: string): any {
    try {
      const splittedToken = token.split('.');
      if (splittedToken.length !== 3) {
        throw new Error('Invalid token structure');
      }
  
      const base64Url = splittedToken[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
      // Adding padding if necessary
      const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  
      // Decode base64 using atob
      const jsonPayload = atob(paddedBase64);
  
      // Optionally check if the payload is valid JSON before parsing
      if (!isValidJSON(jsonPayload)) {
        throw new Error('Invalid JSON payload in token');
      }
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      // console.error('Failed to safely decode JWT:', error);
      throw error;  // Re-throw the error to be handled by the caller
    }
  }

  hasPermission(validatePermission: string): boolean {
    const permissions: string[] = this.getPermissions();
    const hasPermission = permissions.find((permission: string) => permission === validatePermission);
    if (hasPermission) {
      return true;
    }
    return false;
  }
}

function isValidJSON(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}