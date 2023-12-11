import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

	public get(key: string): any | null {
		const value = localStorage.getItem(key);

		if (value === null) return null;
		return JSON.parse(value);
	}

	public set<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
	}
}
