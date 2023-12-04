import numpy as np
from scipy.stats import f

milbank_data = [
    35.9, 29.9, 31.2, 16.2, 19.0, 15.9, 18.8, 22.2, 19.9, 16.4, 5.0, 25.4, 14.7,
    22.7, 18.0, 28.1, 12.1, 21.4, 13.4, 22.9, 21.0, 10.1, 23.0, 19.4, 15.2, 28.2
]
gulf_park_data=[
    21.6, 20.5, 23.3, 18.8, 17.2, 7.7, 18.6, 18.7, 20.4, 22.4, 23.1, 19.8, 26.0,
    17.1,27.9, 20.8
]

var_milbank = np.var(milbank_data, ddof=1)
var_gulf_park = np.var(gulf_park_data,ddof=1)

f_statistic = var_milbank / var_gulf_park
dfn = len(milbank_data) - 1
dfd = len(gulf_park_data) -1

p_value = 2 * min(f.cdf(f_statistic, dfn, dfd), 1 - f.cdf(f_statistic, dfn, dfd))
print(f'Statistic: {f_statistic}')
print(f'P-Value:{p_value}')