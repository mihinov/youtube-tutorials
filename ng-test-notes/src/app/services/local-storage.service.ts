import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

	public get<T = any>(key: string): T | null {
		const value = localStorage.getItem(key);

		if (value === null) return null;

		return JSON.parse(value) as T;
	}

	public set<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	public delete(key: string) {
		localStorage.removeItem(key);
	}
}
