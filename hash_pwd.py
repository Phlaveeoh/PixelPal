# hash_password.py
import bcrypt

def hash_password(password: str, rounds: int = 12) -> str:
    if not password:
        raise ValueError("La password non può essere vuota")
    salt = bcrypt.gensalt(rounds)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

if __name__ == "__main__":
    # esempio: python hash_password.py
    pwd = input("Inserisci la password da hashare: ")
    print("Hash bcrypt:", hash_password(pwd))