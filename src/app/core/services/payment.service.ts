import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentInitiateRequest {
  planId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  paymentMethod: 'card' | 'instapay' | 'wallet';
  amount: number;
}

export interface PaymentInitiateResponse {
  paymentKey: string;
  iframeUrl: string;
  orderId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  /**
   * طلب بدء عملية دفع من الـ Backend
   * الـ Backend سيتواصل مع Paymob ويُرجع الـ Payment Key
   */
  initiatePayment(request: PaymentInitiateRequest): Observable<PaymentInitiateResponse> {
    return this.http.post<PaymentInitiateResponse>(`${this.apiUrl}/initiate`, request);
  }

  /**
   * طلب بيانات الإيصال بعد نجاح العملية
   */
  getReceiptData(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}/receipt`);
  }
}
