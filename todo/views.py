from django.shortcuts import render, redirect
from django.views import View


class Index(View):
    template = 'todo/index.html'

    def get(self, request):
        if request.user.is_authenticated:
            return render(request, self.template)
        else:
            return redirect('users:login')
