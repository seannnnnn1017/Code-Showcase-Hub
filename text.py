import time

start=time.time()
print(start)
f = [0 for i in range(100)] 

def fibo(n):
    if f[n]: 
        return f[n]
    if n <= 1: return n
    f[n] = fibo(n-1) + fibo(n-2) 
    return f[n]

n = 45

print(fibo(n), end=' ')

end=time.time()
print(end)
print(end-start)