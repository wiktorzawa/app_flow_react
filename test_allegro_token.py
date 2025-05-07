import requests
import json

# --------------------------------------------------------------------
# UZUPEŁNIJ SWOIMI NOWYMI KLUCZAMI Z APLIKACJI "app_promosell"
CLIENT_ID = "95ae5c550bfb4492a7c53fc3d52a5896" # Upewnij się, że to Twój aktualny Client ID
CLIENT_SECRET = "yw7VbtrRrbSoLbw1I6VgrK0OIATfk7JXCPV3cVmGYZp501jPYIMObCsrrnTcw6bx" # Upewnij się, że to Twój aktualny Client Secret
# --------------------------------------------------------------------

TOKEN_URL = "https://allegro.pl/auth/oauth/token"

def get_access_token():
    print("--- Starting get_access_token function ---")
    if not CLIENT_ID or not CLIENT_SECRET:
        print("!!! ERROR: CLIENT_ID or CLIENT_SECRET is not set correctly in the script. Please edit the file. !!!")
        return None
    # Sprawdzenie, czy klucze nie są placeholderami
    if "TUTAJ_WKLEJ_SWOJ_NOWY_CLIENT_ID" in CLIENT_ID or "TUTAJ_WKLEJ_SWOJ_NOWY_CLIENT_SECRET" in CLIENT_SECRET:
        print("!!! ERROR: Placeholder CLIENT_ID or CLIENT_SECRET detected. Please replace with actual keys. !!!")
        return None

    try:
        print(f"Attempting to get token with Client ID: {CLIENT_ID[:5]}...") # Log first 5 chars of ID
        data = {'grant_type': 'client_credentials'}
        
        print(f"Sending POST request to: {TOKEN_URL}")
        # Dodajemy timeout na wszelki wypadek
        response = requests.post(TOKEN_URL, data=data, allow_redirects=False, auth=(CLIENT_ID, CLIENT_SECRET), timeout=10)
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {response.headers}")
        # Możesz odkomentować poniższą linię, jeśli chcesz zobaczyć całą surową odpowiedź (może być długa)
        # print(f"Response content (raw): {response.text}") 

        response.raise_for_status()  # Rzuci wyjątkiem dla błędów HTTP 4xx/5xx

        tokens = response.json()
        print(f"Response JSON content: {tokens}")
        access_token = tokens['access_token']
        print("Successfully obtained access token!")
        return access_token
    except requests.exceptions.HTTPError as http_err:
        print(f"!!! HTTP error occurred: {http_err} !!!")
        if hasattr(http_err, 'response') and http_err.response is not None:
            print(f"    Response status code: {http_err.response.status_code}")
            print(f"    Response text: {http_err.response.text}")
        return None # Zwróć None zamiast kończyć skrypt
    except requests.exceptions.RequestException as req_err:
        print(f"!!! Request exception occurred (e.g., network issue, DNS failure): {req_err} !!!")
        return None # Zwróć None
    except json.JSONDecodeError as json_err:
        print(f"!!! JSON decode error occurred: {json_err} !!!")
        print(f"    Response text that failed to parse: {response.text[:500]}...") # Pokaż fragment tekstu, który nie dał się sparsować
        return None
    except Exception as e:
        print(f"!!! An unexpected error occurred: {e} !!!")
        print(f"    Error type: {type(e)}")
        return None # Zwróć None
    finally:
        print("--- Finished get_access_token function ---")


def main():
    print("--- Starting main function ---")
    access_token = get_access_token()
    if access_token:
        print("Access token = " + access_token)
    else:
        print("Failed to obtain access token.")
    print("--- Finished main function ---")

if __name__ == "__main__":
    main()
